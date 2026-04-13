import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; 
import { useHistorial } from '../../hooks/useHistorial';

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
    Download
} from 'lucide-react'; 

// Tarea: Integrar pasesLocales con API 
const mockPases = [
    { id: 'hist-1', tipo: 'pase', motivo: 'Cita médica dental', fecha: '2026-04-15', horaSalida: '10:00', horaRetorno: '12:00', estado: 'aprobado', codigoQR: 'QR-789456' },
    { id: 'hist-3', tipo: 'pase', motivo: 'Trámite bancario urgente', fecha: '2026-04-20', estado: 'pendiente' },
    { id: 'hist-6', tipo: 'pase', motivo: 'Trámite movilidad y transporte', fecha: '2026-04-20', estado: 'rechazado', motivoRechazo: 'Exceso de pases de salida solicitadas' },
    { id: 'hist-4', tipo: 'pase', motivo: 'Emergencia familiar', fecha: '2026-03-15', horaSalida: '14:00', estado: 'usado', codigoQR: 'QR-123456' },
];

export default function Historial() {
    const { user } = useAuth(); 
    const { obtenerJustificantesEmpleado, descargarArchivoJustificante, cargando: cargandoApi } = useHistorial();

    // Estados de UI y Datos
    const [activeTab, setActiveTab] = useState('pases');
    const [pasesLocales, setPasesLocales] = useState(mockPases);
    const [justificantesApi, setJustificantesApi] = useState([]);
    const [cargandoPantalla, setCargandoPantalla] = useState(true);
    const [descargandoArchivo, setDescargandoArchivo] = useState(null); // Rastrea el ID del archivo en descarga

    // Estados de Modales
    const [selectedQR, setSelectedQR] = useState(null);
    const [solicitudAEliminar, setSolicitudAEliminar] = useState(null);
    const [solicitudAEditar, setSolicitudAEditar] = useState(null);

    // Carga inicial y cambio de pestañas
    useEffect(() => {
        const cargarDatos = async () => {
            setCargandoPantalla(true);

            if (activeTab === 'justificantes' && user?.id) { 
                const respuesta = await obtenerJustificantesEmpleado(user.id);
                if (respuesta.exito) {
                    const justificantesFormateados = respuesta.data.map(just => ({
                        id: just.id,
                        tipo: 'justificante',
                        motivo: just.descripcion, 
                        fecha: just.fechaSolicitada, 
                        estado: just.estado ? just.estado.toLowerCase() : 'pendiente',
                        motivoRechazo: just.comentario, 
                        archivos: just.archivos || [] 
                    }));
                    setJustificantesApi(justificantesFormateados);
                }
            } else {
                await new Promise(resolve => setTimeout(resolve, 500)); // Delay simulado para pases
            }
            
            setCargandoPantalla(false);
        };

        cargarDatos();
    }, [activeTab, user]); 

    const solicitudesFiltradas = activeTab === 'pases' ? pasesLocales : justificantesApi;
    const isCargando = cargandoPantalla || cargandoApi;

    // Validación de pases caducados (Ignorar para justificantes)
    const isPaseCaducado = (solicitud) => {
        if (solicitud.tipo !== 'pase' || solicitud.estado !== 'aprobado') return false;
        if (solicitud.fecha && solicitud.horaRetorno) {
            const fechaPase = new Date(solicitud.fecha);
            const [hora, minutos] = solicitud.horaRetorno.split(':');
            fechaPase.setHours(parseInt(hora, 10), parseInt(minutos, 10));
            return new Date() > fechaPase;
        }
        return false;
    };

    // Renderizado del badge de estado
    const getEstadoBadge = (estado, solicitud) => {
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
            usado: { bg: 'bg-gray-100', text: 'text-gray-800', icon: Eye }
        };
        
        const badge = badges[estado] || badges.pendiente;
        const Icon = badge.icon;
        
        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                <Icon size={14} /> {estado.charAt(0).toUpperCase() + estado.slice(1)}
            </span>
        );
    };

    // Handlers de acciones
    const handleEliminar = () => {
        if (solicitudAEliminar.tipo === 'pase') {
            setPasesLocales(prev => prev.filter(s => s.id !== solicitudAEliminar.id));
        } else {
            setJustificantesApi(prev => prev.filter(s => s.id !== solicitudAEliminar.id));
        }
        setSolicitudAEliminar(null);
    };

    const handleGuardarEdicion = (solicitudActualizada) => {
        if (solicitudActualizada.tipo === 'pase') {
            setPasesLocales(prev => prev.map(s => s.id === solicitudActualizada.id ? solicitudActualizada : s));
        }
        setSolicitudAEditar(null);
    };

    const handleDescargarArchivo = async (nombreArchivoGuardado) => {
        if (!user?.id || !nombreArchivoGuardado) return;
        
        setDescargandoArchivo(nombreArchivoGuardado); 
        try {
            const nombreFinal = nombreArchivoGuardado.split('/').pop();
            await descargarArchivoJustificante(user.id, nombreFinal);
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

            {/* Selector de Pestañas */}
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

            {/* Área de Contenido */}
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
                                {/* Ícono de tipo */}
                                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                                    solicitud.tipo === 'pase' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-600'
                                }`}>
                                    {solicitud.tipo === 'pase' ? <DoorOpen size={24} /> : <FileText size={24} />}
                                </div>

                                {/* Detalles principales */}
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
                                    </div>

                                    {/* Nota de rechazo */}
                                    {solicitud.motivoRechazo && (
                                        <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
                                            <strong>Nota/Comentario:</strong> {solicitud.motivoRechazo}
                                        </div>
                                    )}

                                    {/* Archivos adjuntos */}
                                    {solicitud.archivos && solicitud.archivos.length > 0 && (
                                        <div className="mb-4 border-t border-gray-100 pt-3">
                                            <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1">
                                                <Paperclip size={14} /> Archivos adjuntos:
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {solicitud.archivos.map((archivo, idx) => {
                                                    const refArchivo = archivo.urlDescarga || archivo.nombreOriginal;
                                                    const isDownloading = descargandoArchivo === refArchivo;
                                                    
                                                    return (
                                                        <button
                                                            key={idx}
                                                            onClick={() => handleDescargarArchivo(refArchivo)}
                                                            disabled={isDownloading}
                                                            className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-md border transition-colors ${
                                                                isDownloading 
                                                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                                                                : 'bg-gray-50 text-blue-700 border-gray-200 hover:bg-blue-50 hover:border-blue-200'
                                                            }`}
                                                        >
                                                            {isDownloading ? (
                                                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-500"></div>
                                                            ) : (
                                                                <Download size={14} />
                                                            )}
                                                            <span className="truncate max-w-[150px]">{archivo.nombreOriginal}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Botonera de acciones */}
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {solicitud.estado === 'aprobado' && solicitud.tipo === 'pase' && !isPaseCaducado(solicitud) && (
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
                                                className="flex items-center gap-1 bg-white border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm hover:bg-red-50 transition-colors"
                                            >
                                                <Trash2 size={16} /> Eliminar
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modales (Se dejan implementados preventivamente) */}
            <QrModal 
                isOpen={!!selectedQR} 
                onClose={() => setSelectedQR(null)} 
                solicitud={selectedQR} 
            />

            <EditarSolicitudModal 
                isOpen={!!solicitudAEditar}
                onClose={() => setSolicitudAEditar(null)}
                solicitud={solicitudAEditar}
                onSave={handleGuardarEdicion}
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
        </div>
    );
}