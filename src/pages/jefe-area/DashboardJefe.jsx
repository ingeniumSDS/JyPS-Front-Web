import { useState, useEffect, useMemo, useCallback } from 'react';
import { Clock, CheckCircle, XCircle, FileText, Filter, Loader2 } from 'lucide-react';
import DetalleSolicitudModal from '../../components/modals/DetalleSolicitudModal';
import { Card } from '../../components/Card';
import { useIncidencias } from '../../hooks/useIncidencias';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

const obtenerColorTipo = (tipo) => {
    const t = tipo?.toLowerCase();
    if (t === 'justificante') return 'bg-purple-100 text-purple-600';
    if (t === 'pase' || t === 'pase de salida') return 'bg-blue-100 text-blue-600';
    return 'bg-gray-100 text-gray-600';
}

const obtenerColorEstado = (estado) => {
    const e = estado?.toUpperCase();
    if (e === 'APROBADO') return 'bg-green-100 text-green-700 border-green-200';
    if (e === 'RECHAZADO') return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-yellow-100 text-yellow-700 border-yellow-200';
}

export default function DashboardJefe() {
    const { user } = useAuth();
    const { obtenerIncidenciasParaJefe, isLoadingIncidencias } = useIncidencias();

    const [solicitudes, setSolicitudes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
    const [filtroEstado, setFiltroEstado] = useState('PENDIENTE');
    const [filtroTipo, setFiltroTipo] = useState('Todos');

    const cargarDatos = useCallback(async () => {
        if (user?.id) {
            try {
                const datosReales = await obtenerIncidenciasParaJefe(user.id);

                const datosNormalizados = (datosReales || []).map((item, index) => {
                    // Normalización del ID para evitar errores
                    const idReal = item.id || item.justificanteId || item.paseDeSalidaId || item.Id || item.idJustificante || item.folio;
                    
                    return {
                        ...item,
                        id: idReal, 
                        _keySegura: idReal || `temporal-${index}` 
                    };
                });

                setSolicitudes(datosNormalizados);
            } catch (error) {
                toast.error("No se pudieron actualizar las solicitudes.");
                setSolicitudes([]); 
            }
        }
    }, [user?.id, obtenerIncidenciasParaJefe]);

    useEffect(() => {
        cargarDatos();
    }, [cargarDatos]);

    // Lógica de Filtrado
    const solicitudesFiltradas = useMemo(() => {
        return solicitudes
            .filter(s => s.estado?.toUpperCase() === filtroEstado)
            .filter(s => filtroTipo === 'Todos' ? true : s.tipo === filtroTipo);
    }, [solicitudes, filtroEstado, filtroTipo]);

    // Estadísticas
    const statsCount = useMemo(() => ({
        pendientes: solicitudes.filter(s => s.estado?.toUpperCase() === 'PENDIENTE').length,
        aprobados: solicitudes.filter(s => s.estado?.toUpperCase() === 'APROBADO').length,
        rechazados: solicitudes.filter(s => s.estado?.toUpperCase() === 'RECHAZADO').length,
    }), [solicitudes]);

    const stats = [
        { title: 'Pendientes', value: statsCount.pendientes, icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-100', estado: 'PENDIENTE' },
        { title: 'Aprobadas', value: statsCount.aprobados, icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100', estado: 'APROBADO' },
        { title: 'Rechazadas', value: statsCount.rechazados, icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100', estado: 'RECHAZADO' }
    ];

    const handleAbrirDetalle = (solicitud) => {
        setSolicitudSeleccionada(solicitud);
        setIsModalOpen(true);
    };

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#0F2C59] mb-2">Panel de Aprobaciones</h1>
                <p className="text-gray-600">Bienvenido, {user?.nombre}. Gestione las solicitudes de su equipo.</p>
            </div>

            {/* Grid de Estadísticas con interactividad */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                {stats.map((stat) => (
                    <Card 
                        key={stat.title} 
                        className={`p-6 cursor-pointer border-2 transition-all ${filtroEstado === stat.estado ? 'border-[#0F2C59] shadow-md' : 'border-transparent'}`}
                        onClick={() => setFiltroEstado(stat.estado)}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                                <p className="text-3xl font-bold text-[#0F2C59]">{stat.value}</p>
                            </div>
                            <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                                <stat.icon className={stat.color} size={24} />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <Card className="p-6 relative min-h-[400px]">
                {isLoadingIncidencias && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-xl">
                        <Loader2 className="w-10 h-10 text-[#0F2C59] animate-spin mb-2" />
                        <p className="text-sm text-gray-600 font-medium">Cargando información...</p>
                    </div>
                )}

                {/* Filtros */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        Lista de {filtroEstado.toLowerCase()}s
                        <span className="text-xs bg-slate-200 px-2 py-0.5 rounded-full">{solicitudesFiltradas.length}</span>
                    </h2>

                    <div className="flex items-center gap-2">
                        <Filter size={16} className="text-gray-400" />
                        <select 
                            value={filtroTipo}
                            onChange={(e) => setFiltroTipo(e.target.value)}
                            className="text-sm border border-gray-200 rounded-lg p-2 outline-none focus:ring-2 focus:ring-[#0F2C59]/20"
                        >
                            <option value="Todos">Todos los tipos</option>
                            <option value="Pase">Solo Pases</option>
                            <option value="Justificante">Solo Justificantes</option>
                        </select>
                    </div>
                </div>

                {/* Lista */}
                <div className="space-y-3">
                    {solicitudesFiltradas.length > 0 ? (
                        solicitudesFiltradas.map((solicitud) => (
                            <div 
                                key={`${solicitud.tipo}-${solicitud._keySegura}`}
                                onClick={() => handleAbrirDetalle(solicitud)}
                                className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md hover:border-[#0F2C59] cursor-pointer transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${solicitud.tipo === 'Pase' ? 'bg-blue-50 group-hover:bg-blue-100' : 'bg-purple-50 group-hover:bg-purple-100'}`}>
                                        <FileText className={solicitud.tipo === 'Pase' ? 'text-blue-600' : 'text-purple-600'} size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#0F2C59] group-hover:text-blue-900">{solicitud.nombreCompleto || 'Empleado'}</h3>
                                        <div className="flex gap-2 items-center">
                                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${obtenerColorTipo(solicitud.tipo)}`}>
                                                {solicitud.tipo}
                                            </span>
                                            <span className="text-xs text-gray-500 font-medium">{solicitud.fechaVisual}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {/* Badge de Estado */}
                                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md border ${obtenerColorEstado(solicitud.estado)} flex items-center gap-1`}>
                                        {solicitud.estado?.toUpperCase() === 'APROBADO' && <CheckCircle size={12} />}
                                        {solicitud.estado?.toUpperCase() === 'RECHAZADO' && <XCircle size={12} />}
                                        {solicitud.estado?.toUpperCase() === 'PENDIENTE' && <Clock size={12} />}
                                        {solicitud.estado || 'PENDIENTE'}
                                    </span>
                                    <span className="text-xs font-bold text-gray-400 group-hover:text-[#0F2C59]">Ver detalles →</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 text-gray-400">
                            <FileText className="mx-auto mb-2 opacity-10" size={64} />
                            <p className="text-lg">No hay solicitudes {filtroEstado.toLowerCase()}s</p>
                        </div>
                    )}
                </div>
            </Card>

            <DetalleSolicitudModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                solicitud={solicitudSeleccionada}
                onActualizacion={cargarDatos} 
            />
        </div>
    );
}