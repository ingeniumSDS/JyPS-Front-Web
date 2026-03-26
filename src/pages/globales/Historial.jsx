import EditarSolicitudModal from '../../components/modals/EditarSolicitudModal';
import React, { useState, useEffect } from 'react';
import { FileText, LogOut as DoorOpen, CheckCircle, XCircle, Clock, Eye, QrCode, Edit2, Trash2, AlertCircle } from 'lucide-react';
import QrModal from '../../components/modals/QrModal'; 
import ConfirmModal from '../../components/modals/ConfirmModal'; 

// DATOS HARCODEADOS 
const mockHistorial = [
    { id: 'hist-1', tipo: 'pase', motivo: 'Cita médica dental', fecha: '2026-04-15', horaSalida: '10:00', horaRetorno: '12:00', estado: 'aprobado', codigoQR: 'QR-789456' },
    { id: 'hist-2', tipo: 'justificante', motivo: 'Enfermedad general', fecha: '2026-03-18', estado: 'rechazado', motivoRechazo: 'La receta médica no tiene sello oficial.' },
    { id: 'hist-3', tipo: 'pase', motivo: 'Trámite bancario urgente', fecha: '2026-04-20', estado: 'pendiente' },
    { id: 'hist-6', tipo: 'pase', motivo: 'Trámite mobilida y trasporte', fecha: '2026-04-20', estado: 'rechazado', motivoRechazo: 'Exceso de pases de salida solicitadas' },
    { id: 'hist-4', tipo: 'pase', motivo: 'Emergencia familiar', fecha: '2026-03-15', horaSalida: '14:00', estado: 'usado', codigoQR: 'QR-123456' },
    { id: 'hist-5', tipo: 'justificante', motivo: 'Falta por clima extremo', fecha: '2026-03-10', estado: 'aprobado' },
];

export default function Historial() {
    // ESTADOS 
    const [solicitudes, setSolicitudes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [activeTab, setActiveTab] = useState('pases');

    // Estados para Modales
    const [selectedQR, setSelectedQR] = useState(null);
    const [solicitudAEliminar, setSolicitudAEliminar] = useState(null);
    const [solicitudAEditar, setSolicitudAEditar] = useState(null);

    // PREPARACION PARA CONSUMO DE API ---
    useEffect(() => {
        const cargarDatos = setTimeout(() => {
        setSolicitudes(mockHistorial);
        setCargando(false);
        }, 1000);
    return () => clearTimeout(cargarDatos);
    }, []);

    // FILTROS Y LOGICA 
    const solicitudesFiltradas = solicitudes.filter(s => 
        activeTab === 'pases' ? s.tipo === 'pase' : s.tipo === 'justificante'
    );

    const isPaseCaducado = (solicitud) => {
    if (solicitud.tipo !== 'pase' || solicitud.estado !== 'aprobado') return false;
    if (solicitud.fecha && solicitud.horaRetorno) {
        const fechaPase = new Date(solicitud.fecha);
        const [hora, minutos] = solicitud.horaRetorno.split(':');
        fechaPase.setHours(parseInt(hora), parseInt(minutos));
        return new Date() > fechaPase;
        }
        return false;
   };

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

    // MANEJADORES DE EVENTOS 
    const handleEliminar = () => {
    setSolicitudes(prev => prev.filter(s => s.id !== solicitudAEliminar.id));
    setSolicitudAEliminar(null);
    };

    const handleGuardarEdicion = (solicitudActualizada) => {
    // Actualizamos la solicitud en el arreglo de estado
    setSolicitudes(prev => prev.map(s => s.id === solicitudActualizada.id ? solicitudActualizada : s));
    setSolicitudAEditar(null);
};

    return (
    <div className="max-w-4xl mx-auto pb-8">
      {/* Encabezado */}
        <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Historial de Solicitudes</h1>
        <p className="text-gray-500 mt-1">Revisa el estado de tus pases y justificantes</p>
        </div>

      {/* Pestañas de navegación */}
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

      {/* Lista de Tarjetas */}
        {cargando ? (
        <div className="text-center py-10 text-gray-500">Cargando historial...</div>
        ) : solicitudesFiltradas.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg border border-dashed border-gray-300">
            <FileText className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-500">No tienes {activeTab} registrados.</p>
        </div>
        ) : (
        <div className="space-y-4">
            {solicitudesFiltradas.map((solicitud) => (
            <div 
                key={solicitud.id} 
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
            >
                <div className="flex items-start gap-4">
                {/* Icono izquierdo */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                    solicitud.tipo === 'pase' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-600'
                }`}>
                    {solicitud.tipo === 'pase' ? <DoorOpen size={24} /> : <FileText size={24} />}
                </div>

                {/* Contenido principal */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-gray-800 text-lg">
                        {solicitud.tipo === 'pase' ? 'Pase de Salida' : 'Justificante'}
                    </h3>
                    {getEstadoBadge(solicitud.estado, solicitud)}
                    </div>

                    <p className="text-gray-600 mb-3">{solicitud.motivo}</p>

                  {/* Detalles (Fecha, Horas) */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">📅 {solicitud.fecha}</span>
                    {solicitud.horaSalida && <span className="flex items-center gap-1">🕐 Salida: {solicitud.horaSalida}</span>}
                    </div>

                  {/* Mensaje de rechazo */}
                    {solicitud.motivoRechazo && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-800">
                        <strong>Motivo de rechazo:</strong> {solicitud.motivoRechazo}
                    </div>
                    )}

                  {/* Acciones (Botones) */}
                    <div className="flex flex-wrap gap-2 mt-2">
                    {/* Botón ver QR */}
                    {solicitud.estado === 'aprobado' && solicitud.tipo === 'pase' && !isPaseCaducado(solicitud) && (
                        <button 
                        onClick={() => setSelectedQR(solicitud)}
                        className="flex items-center gap-1 bg-blue-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-800 transition-colors"
                        >
                        <QrCode size={16} /> Ver Código QR
                        </button>
                    )}

                    {/* Botones Editar / Eliminar */}
                    {solicitud.estado === 'pendiente' && (
                        <>
                        <button
                            onClick={() => setSolicitudAEditar(solicitud)}
                            className="flex items-center gap-1 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                            <Edit2 size={16} /> Editar
                        </button>
                        <button 
                            onClick={() => setSolicitudAEliminar(solicitud)}
                            className="flex items-center gap-1 bg-white border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm hover:bg-red-50 transition-colors"
                        >
                            <Trash2 size={16} /> Eliminar
                        </button>
                        </>
                    )}
                    </div>
                </div>
                </div>
            </div>
            ))}
        </div>
        )}

      {/* Modal del QR */}
        <QrModal 
        isOpen={!!selectedQR} 
        onClose={() => setSelectedQR(null)} 
        solicitud={selectedQR} 
        />

      {/* Modal de Edición */}
        <EditarSolicitudModal 
            isOpen={!!solicitudAEditar}
            onClose={() => setSolicitudAEditar(null)}
            solicitud={solicitudAEditar}
            onSave={handleGuardarEdicion}
        />

        {/*Modal confirmacion*/}
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