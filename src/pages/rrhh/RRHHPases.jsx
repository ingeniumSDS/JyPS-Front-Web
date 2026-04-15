import { useState, useEffect } from 'react';
import { LogOut, Calendar, User, FileText, Search, Clock, ClipboardList, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { useAuditor } from '../../hooks/useAuditor'; 

export default function Pases() {
    const { obtenerPases, cargando } = useAuditor();

    const [pases, setPases] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Estados para las fechas
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');

    // Inicializar fechas al DÍA DE HOY
    useEffect(() => {
        const hoy = new Date();
        const anio = hoy.getFullYear();
        const mes = String(hoy.getMonth() + 1).padStart(2, '0'); 
        const dia = String(hoy.getDate()).padStart(2, '0');
        const hoyFormateado = `${anio}-${mes}-${dia}`;

        setFechaInicio(hoyFormateado);
        setFechaFin(hoyFormateado);
    }, []);

    // Cargar pases cada vez que cambie el rango de fechas
    useEffect(() => {
        const cargarDatosPorRango = async () => {
            if (!fechaInicio || !fechaFin) return; 

            if (new Date(fechaInicio) > new Date(fechaFin)) {
                console.warn("La fecha de inicio no puede ser mayor a la fecha de fin");
                return;
            }

            const res = await obtenerPases(fechaInicio, fechaFin);
            if (res.exito) {
                setPases(res.data);
            }
        };

        cargarDatosPorRango();
    }, [fechaInicio, fechaFin]);

    // Aplicar Filtro Local (Búsqueda de texto)
    let pasesFiltrados = pases;

    if (searchTerm) {
        pasesFiltrados = pasesFiltrados.filter(p =>
            p.nombreCompleto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // Cálculos para las tarjetas basándonos en los estados del endpoint (A_TIEMPO, RETARDO)
    const totalPases = pasesFiltrados.length;
    const aTiempo = pasesFiltrados.filter(p => p.estado === 'A_TIEMPO').length;
    const retrasados = pasesFiltrados.filter(p => p.estado === 'RETARDO').length;

    // Utilidades de formato
    const formatDate = (dateStr) => {
        if (!dateStr) return 'Sin fecha';
        const date = new Date(dateStr + 'T00:00:00'); 
        return date.toLocaleDateString('es-MX', {
            day: '2-digit', month: 'long', year: 'numeric'
        });
    };

    const formatTime = (dateStr) => {
        if (!dateStr) return '--:--';
        const date = new Date(dateStr);
        // Si el formato falla o es una cadena simple, lo retornamos directo
        return isNaN(date.getTime()) ? dateStr : date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="p-4 sm:p-6 md:p-2">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#0F2C59]">Pases de Salida</h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">Registro de salidas autorizadas durante horario laboral</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <Card className="p-4 sm:p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#0F2C59]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <ClipboardList size={24} className="text-[#0F2C59]" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Pases</p>
                            <p className="text-2xl font-bold text-[#0F2C59]">{totalPases}</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-4 sm:p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#28A745]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <CheckCircle size={24} className="text-[#28A745]" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">A Tiempo</p>
                            <p className="text-2xl font-bold text-[#28A745]">{aTiempo}</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-4 sm:p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <XCircle size={24} className="text-red-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Retrasados</p>
                            <p className="text-2xl font-bold text-red-600">{retrasados}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Search and Filters */}
            <Card className="p-4 sm:p-6 mb-6">
                <div className="space-y-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <Input
                            type="text"
                            placeholder="Buscar por nombre o descripción..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-full"
                        />
                    </div>

                    {/* Filtros de Fechas */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Filtros de Búsqueda</label>
                        <div className="flex flex-col lg:flex-row gap-4 lg:items-end justify-between border-t border-gray-100 pt-4">
                            
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Fecha Inicio</label>
                                    <Input
                                        type="date"
                                        value={fechaInicio}
                                        onChange={(e) => setFechaInicio(e.target.value)}
                                        className="w-full sm:w-auto"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Fecha Fin</label>
                                    <Input
                                        type="date"
                                        value={fechaFin}
                                        onChange={(e) => setFechaFin(e.target.value)}
                                        className="w-full sm:w-auto"
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </Card>

            {/* List */}
            <div className="space-y-4">
                {cargando ? (
                    <Card className="p-8 text-center flex flex-col items-center">
                        <Loader2 className="animate-spin text-[#0F2C59] mb-2" size={32} />
                        <p className="text-gray-500">Cargando pases de salida...</p>
                    </Card>
                ) : pasesFiltrados.length === 0 ? (
                    <Card className="p-8 text-center">
                        <LogOut size={48} className="mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500 text-sm sm:text-base">
                            {searchTerm ? 'No se encontraron pases con ese criterio' : 'No hay pases de salida para este rango de fechas.'}
                        </p>
                    </Card>
                ) : (
                    pasesFiltrados.map((pase) => (
                        <Card key={pase.id} className="p-4 sm:p-6 hover:shadow-md transition-shadow">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-[#0F2C59] rounded-full flex items-center justify-center flex-shrink-0">
                                            <User size={20} className="text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-[#0F2C59] text-sm sm:text-base">{pase.nombreCompleto}</h3>
                                            <p className="text-xs sm:text-sm text-gray-600">ID Empleado: {pase.empleadoId}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                                        <div className="flex items-start gap-2 text-xs sm:text-sm">
                                            <Calendar size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <span className="text-gray-600 mr-1">Fecha:</span>
                                                <span className="font-medium text-[#0F2C59]">{formatDate(pase.fechaSolicitud)}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-2 text-xs sm:text-sm">
                                            <Clock size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <span className="text-gray-600 mr-1">Horario:</span>
                                                <span className="font-medium text-[#0F2C59]">
                                                    {formatTime(pase.horaSalidaReal)} - {formatTime(pase.horaRetornoReal)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-2 text-xs sm:text-sm md:col-span-2">
                                            <FileText size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <span className="text-gray-600 mr-1">Descripción:</span>
                                                <span className="font-medium text-[#0F2C59]">{pase.descripcion || 'Sin descripción'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center lg:justify-end">
                                    <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium
                                        ${pase.estado === 'RETARDO' 
                                            ? 'bg-red-100 text-red-600' 
                                            : 'bg-[#28A745]/10 text-[#28A745]'}`
                                    }>
                                        {pase.estado === 'RETARDO' ? <XCircle size={16} /> : <LogOut size={16} />}
                                        {pase.estado === 'RETARDO' ? 'Retrasado' : (pase.estado === 'A_TIEMPO' ? 'A Tiempo' : pase.estado)}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}