import { useState, useEffect } from 'react';
import { FileCheck, Calendar, User, FileText, Search, Loader2 } from 'lucide-react';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { useAuditor } from '../../hooks/useAuditor'; 

export default function Justificantes() {
    // 1. Ya no extraemos obtenerDepartamentos
    const { obtenerJustificantes, cargando } = useAuditor();

    const hoy = new Date().toISOString().split('T')[0];

    const [justificantes, setJustificantes] = useState([]);
    const [isCargandoInicial, setIsCargandoInicial] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState(hoy);

    const cargarDatosIniciales = async () => {
        setIsCargandoInicial(true);
        
        const fechaActual = new Date();
        const anio = fechaActual.getFullYear();
        const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');

        // Eliminada la petición de departamentos

        setIsCargandoInicial(false); 
        setFechaInicio(`${anio}-${mes}-01`);
        setFechaFin(hoy);
    };

    useEffect(() => {
        cargarDatosIniciales();
    }, []);

    useEffect(() => {
        const cargarDatosPorRango = async () => {
            if (!fechaInicio || !fechaFin) return; 

            if (new Date(fechaInicio) > new Date(fechaFin)) {
                console.warn("La fecha de inicio no puede ser mayor a la fecha de fin");
                return;
            }

            const res = await obtenerJustificantes(fechaInicio, fechaFin);
            if (res?.exito) {
                setJustificantes(res.data);
            }
        };

        cargarDatosPorRango();
    }, [fechaInicio, fechaFin]);

    let justificantesFiltrados = justificantes;

    // Eliminado el if que filtraba por departamento

    if (searchTerm) {
        justificantesFiltrados = justificantesFiltrados.filter(j =>
            j.nombreCompleto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            j.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return 'Sin fecha';
        const date = new Date(dateStr + 'T00:00:00'); 
        return date.toLocaleDateString('es-MX', {
            day: '2-digit', month: 'long', year: 'numeric'
        });
    };
    
    if (isCargandoInicial) {
        return (
            <div className="flex flex-col justify-center items-center h-64 text-[#0F2C59] font-semibold gap-3">
                <Loader2 className="animate-spin text-[#0F2C59]" size={32} />
                <span>Cargando información...</span>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 md:p-2">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#0F2C59]">Justificantes</h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">Auditoría y registro de justificantes</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#28A745]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileCheck size={24} className="text-[#28A745]" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total en el periodo</p>
                            <p className="text-2xl font-bold text-[#0F2C59]">{justificantesFiltrados.length}</p>
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

                    {/* Filtros de Rango de Fechas */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Filtros de Fechas</label>
                        <div className="flex flex-col lg:flex-row gap-4 lg:items-end justify-between border-t border-gray-100 pt-4">
                            
                            {/* Inputs de Fechas */}
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
                                        max={hoy} 
                                        onChange={(e) => setFechaFin(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Listado */}
            <div className="space-y-4">
                {cargando ? (
                    <Card className="p-8 text-center flex flex-col items-center">
                        <Loader2 className="animate-spin text-[#0F2C59] mb-2" size={32} />
                        <p className="text-gray-500">Cargando justificantes...</p>
                    </Card>
                ) : justificantesFiltrados.length === 0 ? (
                    <Card className="p-8 text-center">
                        <FileCheck size={48} className="mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500 text-sm sm:text-base">No hay justificantes para este rango de fechas.</p>
                    </Card>
                ) : (
                    justificantesFiltrados.map((justificante, index) => (
                        <Card key={justificante.id || index} className="p-4 sm:p-6 hover:shadow-md transition-shadow">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-[#0F2C59] rounded-full flex items-center justify-center flex-shrink-0">
                                            <User size={20} className="text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-[#0F2C59] text-sm sm:text-base">
                                                {justificante.nombreCompleto}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                                        <div className="flex items-start gap-2 text-xs sm:text-sm">
                                            <Calendar size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <span className="text-gray-600 mr-1">Solicitado:</span>
                                                <span className="font-medium text-[#0F2C59]">
                                                    {formatDate(justificante.fechaSolicitada)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-2 text-xs sm:text-sm">
                                            <FileText size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <span className="text-gray-600 mr-1">Descripción:</span>
                                                <span className="font-medium text-[#0F2C59]">
                                                    {justificante.descripcion || 'Sin descripción'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center lg:justify-end">
                                    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#28A745]/10 text-[#28A745] rounded-full text-xs sm:text-sm font-medium">
                                        <FileCheck size={16} />
                                        {justificante.estado || 'Aprobado'}
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