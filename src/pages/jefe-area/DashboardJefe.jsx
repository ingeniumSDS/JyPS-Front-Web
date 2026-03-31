import { useState } from 'react';
import { Clock, CheckCircle, XCircle, FileText, Filter } from 'lucide-react';
import DetalleSolicitudModal from '../../components/modals/DetalleSolicitudModal';
import { Card } from '../../components/Card';

// Mock data representing incoming requests
const MOCK_SOLICITUDES = [
  { id: 1, tipo: 'Pase', estado: 'Pendiente', createdAt: '2026-03-29T08:00:00', fecha: '2026-03-29', horaSalida: '10:00', motivo: 'Cita médica de urgencia', trabajador: { nombre: 'Juan Pérez', email: 'juan@empresa.com' } },
  { id: 2, tipo: 'Justificante', estado: 'Pendiente', createdAt: '2026-03-28T09:30:00', fecha: '2026-03-28', motivo: 'Falta por enfermedad leve', evidencia: 'receta.pdf', trabajador: { nombre: 'María García', email: 'maria@empresa.com' } },
  { id: 3, tipo: 'Pase', estado: 'Aprobado', createdAt: '2026-03-27T14:00:00', fecha: '2026-03-27', horaSalida: '15:30', motivo: 'Trámite bancario personal', revisadoPor: 'Roberto Director', trabajador: { nombre: 'Carlos López', email: 'carlos@empresa.com' } },
  { id: 4, tipo: 'Justificante', estado: 'Rechazado', createdAt: '2026-03-26T11:15:00', fecha: '2026-03-26', motivo: 'Retardo por tráfico pesado', motivoRechazo: 'El tráfico no es un motivo justificable según la política interna.', trabajador: { nombre: 'Ana Martínez', email: 'ana@empresa.com' } },
  { id: 5, tipo: 'Pase', estado: 'Pendiente', createdAt: '2026-03-29T09:45:00', fecha: '2026-03-29', horaSalida: '13:00', motivo: 'Junta en la escuela de mi hijo', trabajador: { nombre: 'Luis Rodríguez', email: 'luis@empresa.com' } }
];

export default function DashboardJefe() {
  // Modal state management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);

  // Filter state management
  const [filtroEstado, setFiltroEstado] = useState('Pendiente'); 
  const [filtroTipo, setFiltroTipo] = useState('Todos'); 

  // Handles opening the detail modal for a specific request
  const handleAbrirDetalle = (solicitud) => {
    // Flatten data object to match Modal component expectations
    const requestDetails = {
      ...solicitud,
      nombre: solicitud.trabajador.nombre,
      email: solicitud.trabajador.email,
    };
    setSolicitudSeleccionada(requestDetails);
    setIsModalOpen(true);
  };

  // Statistics calculations
  const pendientes = MOCK_SOLICITUDES.filter(s => s.estado === 'Pendiente').length;
  const aprobados = MOCK_SOLICITUDES.filter(s => s.estado === 'Aprobado').length;
  const rechazados = MOCK_SOLICITUDES.filter(s => s.estado === 'Rechazado').length;

  const stats = [
    { title: 'Pendientes', value: pendientes, icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    { title: 'Aprobadas', value: aprobados, icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100' },
    { title: 'Rechazadas', value: rechazados, icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100' }
  ];

  // Filtering and sorting logic
  const solicitudesFiltradas = MOCK_SOLICITUDES
    .filter(s => s.estado === filtroEstado)
    .filter(s => filtroTipo === 'Todos' ? true : s.tipo === filtroTipo)
    .sort((a, b) => {
      // Sort pending requests by oldest first for priority queue
      if (filtroEstado === 'Pendiente') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      // Sort processed requests by newest first (History log)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const getEstadoBadge = (estado) => {
    const badges = {
      Pendiente: 'bg-yellow-100 text-yellow-800',
      Aprobado: 'bg-green-100 text-green-800',
      Rechazado: 'bg-red-100 text-red-800'
    };
    return badges[estado] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0F2C59] mb-2">Panel de Aprobaciones</h1>
        <p className="text-sm sm:text-base text-gray-600">Revisa y gestiona las solicitudes de tu equipo.</p>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-[#0F2C59]">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={stat.color} size={24} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Main Content Container */}
      <Card className="p-4 sm:p-6">
        
        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg inline-flex">
            {['Pendiente', 'Aprobado', 'Rechazado'].map((estado) => (
              <button
                key={estado}
                onClick={() => setFiltroEstado(estado)}
                className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${ 
                  filtroEstado === estado
                    ? 'bg-white text-[#0F2C59] shadow-sm'
                    : 'text-gray-600 hover:text-[#0F2C59]'
                }`}
              >
                {estado}s
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select 
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="text-sm border-gray-300 rounded-lg focus:ring-[#0F2C59] focus:border-[#0F2C59] bg-white px-3 py-2 border outline-none"
            >
              <option value="Todos">Mostrar Ambos</option>
              <option value="Pase">Solo Pases</option>
              <option value="Justificante">Solo Justificantes</option>
            </select>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-3">
          {solicitudesFiltradas.length > 0 ? (
            solicitudesFiltradas.map((solicitud) => (
              <div 
                key={solicitud.id} 
                onClick={() => handleAbrirDetalle(solicitud)} 
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md hover:border-[#0F2C59] cursor-pointer transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${ 
                    solicitud.tipo === 'Pase' ? 'bg-blue-50' : 'bg-purple-50'
                  }`}>
                    <FileText className={solicitud.tipo === 'Pase' ? 'text-blue-600' : 'text-purple-600'} size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{solicitud.trabajador.nombre}</h3>
                    <p className="text-sm text-gray-500">
                      {solicitud.tipo === 'Pase' ? 'Pase de Salida' : 'Justificante'} • {solicitud.motivo.substring(0, 30)}{solicitud.motivo.length > 30 ? '...' : ''}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(solicitud.createdAt).toLocaleDateString('es-MX')}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(solicitud.createdAt).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoBadge(solicitud.estado)}`}>
                    {solicitud.estado}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <FileText className="mx-auto text-gray-300 mb-3" size={40} />
              <p className="text-gray-500 font-medium">No hay solicitudes {filtroEstado.toLowerCase()}s en esta categoría.</p>
            </div>
          )}
        </div>
      </Card>

      {/* Detail Modal Component */}
      <DetalleSolicitudModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        solicitud={solicitudSeleccionada} 
      />
    </div>
  );
}