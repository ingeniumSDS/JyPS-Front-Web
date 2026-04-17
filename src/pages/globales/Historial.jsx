import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; 
import { useHistorial } from '../../hooks/useHistorial';
import { toast } from 'sonner';
import EditarSolicitudModal from '../../components/modals/EditarSolicitudModal';
import QrModal from '../../components/modals/QrModal'; 
import ConfirmModal from '../../components/modals/ConfirmModal'; 
import { 
    FileText, 
    LogOut as DoorOpen, 
    CheckCircle, 
    XCircle, 
    Clock, 
    Eye, 
    QrCode, 
    Trash2, 
    AlertCircle,
    Paperclip,
    Download,
    RotateCcw
} from 'lucide-react'; 

export default function Historial() {
    const { user } = useAuth(); 
    const { 
        revocarPaedesalida,
        obtenerJustificantesEmpleado, 
        obtenerPasesEmpleado,
        descargarArchivoJustificante, 
        eliminarPase,         
        eliminarJustificante, 
        cargando: cargandoApi 
    } = useHistorial();

    const [activeTab, setActiveTab] = useState('pases');
    const [pasesApi, setPasesApi] = useState([]);
    const [justificantesApi, setJustificantesApi] = useState([]);
    const [cargandoPantalla, setCargandoPantalla] = useState(true);
    const [descargandoArchivo, setDescargandoArchivo] = useState(null);

    const [selectedQR, setSelectedQR] = useState(null);
    const [solicitudAEliminar, setSolicitudAEliminar] = useState(null);
    const [solicitudRevocar, setsolicitudRevocar] = useState(null);
    const [solicitudAEditar, setSolicitudAEditar] = useState(null);

    // Formateador robusto para la UI
    const formatearHora = (fechaIso) => {
        if (!fechaIso) return null;
        const date = new Date(fechaIso);
        return isNaN(date) ? null : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    const formatearFecha = (fechaIso) => {
        if (!fechaIso) return '';
        const date = new Date(fechaIso);
        return isNaN(date) ? '' : date.toLocaleDateString();
    };

    useEffect(() => {
        const cargarDatos = async () => {
            setCargandoPantalla(true);
            if (!user?.id) { setCargandoPantalla(false); return; }

            if (activeTab === 'justificantes') { 
                const respuesta = await obtenerJustificantesEmpleado(user.id);
                if (respuesta.exito) {
                    const justificantesFormateados = respuesta.data.map(just => ({
                        id: just.id,
                        tipo: 'justificante',
                        motivo: just.descripcion, 
                        fecha: formatearFecha(just.fechaSolicitada), 
                        estado: just.estado ? just.estado.toLowerCase() : 'pendiente',
                        motivoRechazo: just.comentario, 
                        archivos: just.archivos || [] 
                    }));
                    setJustificantesApi(justificantesFormateados);
                }
            } else if (activeTab === 'pases') {
                const respuesta = await obtenerPasesEmpleado(user.id);
                console.log("Datos crudos de obtenerPasesEmpleado:", respuesta);

                if (respuesta.exito) {
                    const pasesFormateados = respuesta.data.map(pase => ({
                        id: pase.id,
                        tipo: 'pase',
                        motivo: pase.descripcion, 
                        fechaRaw: pase.horaSolicitada, 
                        horaRetornoRaw: pase.horaEsperada,
                        fecha: formatearFecha(pase.horaSolicitada),
                        horaSalida: formatearHora(pase.horaSolicitada),
                        horaRetorno: formatearHora(pase.horaEsperada),
                        estado: pase.estado ? pase.estado.toLowerCase() : 'pendiente',
                        motivoRechazo: pase.comentario, 
                        codigoQR: pase.QR, 
                        archivos: pase.archivos ? pase.archivos.map(a => typeof a === 'string' ? { nombreOriginal: a } : a) : []
                    }));
                    setPasesApi(pasesFormateados);
                }
            }
            setCargandoPantalla(false);
        };
        cargarDatos();
    }, [activeTab, user]); 

    const solicitudesFiltradas = activeTab === 'pases' ? pasesApi : justificantesApi;
    const isCargando = cargandoPantalla || cargandoApi;

    //  Solo caduca si el API dice
    const isPaseCaducado = (solicitud) => {
        if (solicitud.tipo !== 'pase' || solicitud.estado !== 'aprobado') return false;
        
        // Usamos la hora de retorno 
        if (solicitud.horaRetornoRaw) {
            const fechaLimite = new Date(solicitud.horaRetornoRaw);
            const ahora = new Date();
            return ahora > fechaLimite;
        }
        return false;
    };

    const getEstadoBadge = (estado, solicitud) => {
        //  Si el estado del API 
        if (estado === 'usado' || estado === 'utilizado') {
            return (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    <CheckCircle size={14} /> Usado
                </span>
            );
        }

        //  Solo si el API dice 'aprobado'
        if (solicitud && isPaseCaducado(solicitud)) {
            return (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    <AlertCircle size={14} /> Caducado
                </span>
            );
        }

        const badges = {
            aprobado: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
            rechazado: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
            pendiente: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
            fuera: { bg: 'bg-purple-100', text: 'text-purple-800', icon: DoorOpen },
            revocado: { bg: 'bg-gray-200', text: 'text-gray-700', icon: RotateCcw }, // AGREGADO para que se vea bien al recargar
        };
        
        const badge = badges[estado] || badges.pendiente;
        const Icon = badge.icon;
        
        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                <Icon size={14} /> {estado.replace('_', ' ').charAt(0).toUpperCase() + estado.slice(1).replace('_', ' ')}
            </span>
        );
    };

    const handleEliminar = async () => {
        if (!solicitudAEliminar) return;
        //VALIDACION ESTRICTA
        if (solicitudAEliminar.estado !== 'pendiente') {
            toast.error("Acción no permitida: Solo se pueden eliminar solicitudes en estado pendiente.");
            setSolicitudAEliminar(null);
            return;
        }
        let respuesta;
        // API por tipo
        if (solicitudAEliminar.tipo === 'pase') {
            respuesta = await eliminarPase(solicitudAEliminar.id);
            //Exito, actualizamos
            if (respuesta.exito) {
                setPasesApi(prev => prev.filter(s => s.id !== solicitudAEliminar.id));
                toast.success("Pase eliminado correctamente.");
            }
        } else {
            respuesta = await eliminarJustificante(solicitudAEliminar.id);
             //Exito, actualizamos
            if (respuesta.exito) {
                setJustificantesApi(prev => prev.filter(s => s.id !== solicitudAEliminar.id));
                toast.success("Justificante eliminado correctamente.");
            }
        }
        //Manejo de errores
        if (!respuesta.exito) {
            toast.error(`No se pudo eliminar la solicitud`);
        }
        // Cerrar el modal 
        setSolicitudAEliminar(null);
    };

    // FUNCIÓN REVOCAR CORREGIDA
    const handleRevocar = async () => {
        if (!solicitudRevocar) return;

        if(solicitudRevocar.estado !== 'aprobado'){
            toast.error("Acción no permitida: Solo se pueden revocar solicitudes en estado aprobado.");
            setsolicitudRevocar(null);
            return;
        }
        
        let respuesta = { exito: false }; 
        
        if(solicitudRevocar.tipo === "pase"){
            respuesta = await revocarPaedesalida(solicitudRevocar.id);
            
            if (respuesta.exito){
                setPasesApi(prev => prev.map(s => 
                    s.id === solicitudRevocar.id ? { ...s, estado: 'revocado' } : s
                ));
                toast.success("Pase revocado correctamente.");
            }
        } 
        
        if (!respuesta.exito){
            toast.error(`No se pudo revocar`);
        }
        
        setsolicitudRevocar(null);
    }

    const handleGuardarEdicion = (solicitudActualizada) => {
        if (solicitudActualizada.tipo === 'pase') {
            setPasesApi(prev => prev.map(s => s.id === solicitudActualizada.id ? solicitudActualizada : s));
        }
        setSolicitudAEditar(null);
    };

    const handleDescargarArchivo = async (nombreArchivoGuardado) => {
        if (!user?.id || !nombreArchivoGuardado) return;
        setDescargandoArchivo(nombreArchivoGuardado); 
        try {
            const nombreFinal = nombreArchivoGuardado.split('/').pop();
            await descargarArchivoJustificante(user.id, nombreFinal); 
            toast.success("Descarga exitosa");
        } catch (error) {
            toast.error(error?.message || "Error al intentar descargar el archivo.");
        } finally {
            setDescargandoArchivo(null); 
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Historial de Solicitudes</h1>
                <p className="text-gray-500 mt-1">Revisa el estado de tus pases y justificantes</p>
            </div>

            <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
                <button
                    onClick={() => setActiveTab('pases')}
                    className={`flex-1 py-3 px-4 rounded-md font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                        activeTab === 'pases' ? 'bg-white text-blue-900 shadow-sm' : 'text-gray-500 hover:text-blue-900'
                    }`}
                >
                    <DoorOpen size={18} /> Pases de Salida
                </button>
                <button
                    onClick={() => setActiveTab('justificantes')}
                    className={`flex-1 py-3 px-4 rounded-md font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                        activeTab === 'justificantes' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-green-700'
                    }`}
                >
                    <FileText size={18} /> Justificantes
                </button>
            </div>

            {isCargando ? (
                <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mb-2"></div>
                    <p>Cargando historial...</p>
                </div>
            ) : solicitudesFiltradas.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-lg border border-dashed border-gray-300">
                    <FileText className="mx-auto mb-4 text-gray-400" size={48} />
                    <p className="text-gray-500">No tienes {activeTab} registrados.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {solicitudesFiltradas.map((solicitud) => (
                        <div key={solicitud.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                                    solicitud.tipo === 'pase' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-600'
                                }`}>
                                    {solicitud.tipo === 'pase' ? <DoorOpen size={24} /> : <FileText size={24} />}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                        <h3 className="font-semibold text-gray-800 text-lg">
                                            {solicitud.tipo === 'pase' ? 'Pase de Salida' : 'Justificante'}
                                        </h3>
                                        {getEstadoBadge(solicitud.estado, solicitud)}
                                    </div>

                                    <p className="text-gray-600 mb-3">{solicitud.motivo}</p>

                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                                        <span className="flex items-center gap-1">📅 {solicitud.fecha}</span>
                                        {solicitud.horaSalida && <span className="flex items-center gap-1">🕐 Salida: {solicitud.horaSalida}</span>}
                                        {solicitud.horaRetorno && <span className="flex items-center gap-1">🕐 Retorno: {solicitud.horaRetorno}</span>}
                                    </div>

                                    {solicitud.motivoRechazo && (
                                        <div className="mb-4 p-3 bg-gray-50  border border-gray-200 rounded-lg text-sm text-gray-700">
                                            <strong>Nota del Jefe:</strong> {solicitud.motivoRechazo}
                                        </div>
                                    )}

                                    {solicitud.archivos && solicitud.archivos.length > 0 && (
                                        <div className="mb-4 border-t border-gray-100 pt-3">
                                            <div className="flex flex-wrap gap-2">
                                                {solicitud.archivos.map((archivo, idx) => {
                                                    const refArchivo = archivo.urlDescarga || archivo.nombreOriginal;
                                                    const isDownloading = descargandoArchivo === refArchivo;
                                                    return (
                                                        <button
                                                            key={idx}
                                                            onClick={() => handleDescargarArchivo(refArchivo)}
                                                            disabled={isDownloading}
                                                            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-md border bg-gray-50 text-blue-700 border-gray-200 hover:bg-blue-50"
                                                        >
                                                            <Download size={14} />
                                                            <span className="truncate max-w-[150px]">{archivo.nombreOriginal}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {(solicitud.estado === 'aprobado' || solicitud.estado=== 'fuera' )&& solicitud.tipo === 'pase' && solicitud.codigoQR && !isPaseCaducado(solicitud) && (
                                            <button 
                                                onClick={() => setSelectedQR(solicitud)}
                                                className="flex items-center gap-1 bg-blue-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-800 transition-colors"
                                            >
                                                <QrCode size={16} /> Ver Código QR
                                            </button>
                                        )}

                                        {solicitud.estado === 'pendiente' && (
                                            <button 
                                                onClick={() => setSolicitudAEliminar(solicitud)}
                                                className="flex items-center gap-1 bg-white border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm hover:bg-red-50"
                                            >
                                                <Trash2 size={16} /> Eliminar
                                            </button>
                                        )}

                                        {solicitud.estado === 'aprobado' &&(
                                            <button
                                                onClick={() =>   setsolicitudRevocar(solicitud)}
                                                className="flex items-center gap-1 bg-white border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm hover:bg-red-50"
                                            >
                                                <RotateCcw size={16} />Revocar 
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <QrModal 
                isOpen={!!selectedQR} 
                onClose={() => setSelectedQR(null)} 
                solicitud={selectedQR} 
                valorQR={selectedQR?.codigoQR} 
            />

            <ConfirmModal 
                isOpen={!!solicitudAEliminar}
                onClose={() => setSolicitudAEliminar(null)}
                onConfirm={handleEliminar}
                title="Eliminar solicitud"
                message={`¿Estás seguro? Esta acción eliminará tu solicitud de ${solicitudAEliminar?.tipo} y no se puede deshacer.`}
                type="danger"
                confirmText="Sí, eliminar"
            />

            <ConfirmModal 
                isOpen={!!solicitudRevocar}
                onClose={() => setsolicitudRevocar(null)}
                onConfirm={handleRevocar}
                title="Revocar solicitud"
                message={`¿Estás seguro? Esta acción revocara tu solicitud de ${solicitudRevocar?.tipo} y no se puede deshacer.`}
                type="danger"
                confirmText={"Si, revocar"}       
            />
        </div>
    );
}