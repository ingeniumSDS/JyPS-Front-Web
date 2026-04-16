import { useState, useEffect } from 'react';
import { Building2, Plus, Search, Edit2, Check, CheckCircle, XCircle, Users, UserCheck, XIcon, Loader2 } from 'lucide-react';
import { Card } from '../../components/Card'; 
import { Button } from '../../components/Button'; 
import { Input } from '../../components/Input';
import ConfirmModal from '../../components/modals/ConfirmModal';
import DepartamentoFormModal from '../../components/modals/DepartamentoFormModal';
import { toast } from 'sonner';
import { useGestion } from '../../hooks/useGestion'; 

export default function GestionDepartamentos() {

    const [jefesDisponibles, setJefesDisponibles] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [isLoading, setIsLoading] = useState(true); 
    const [busqueda, setBusqueda] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('Todos');
    const [isSaving, setIsSaving] = useState(false);

    const { obtenerDepartamento, crearDepartamento, obtenerUsuarios, asignarUnJefe } = useGestion();

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [departamentoAEditar, setDepartamentoAEditar] = useState(null);
    const [formData, setFormData] = useState({ nombre: '', descripcion: '', jefeId: '' });
    
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        departamentoId: null,
        nuevoEstado: '',
        type: 'success'
    });

    // Cargar Jefes
    useEffect(() => {
        const fetchJefes = async () => {
            try {
                const respuesta = await obtenerUsuarios(); 
                const usuariosArray = respuesta.data ? respuesta.data : respuesta;

                if (Array.isArray(usuariosArray)) {
                    const soloJefes = usuariosArray.filter(usuario => usuario.rol === 'jefe_de_departamento');
                    setJefesDisponibles(soloJefes);
                } else {
                    console.error("Formato de usuarios no válido");
                }
            } catch (error) {
                console.error("Error al obtener usuarios");
            }
        };

        fetchJefes();
    }, []);

    // Cargar Departamentos
    useEffect(() => {
        const cargarDepartamentos = async () => {
            setIsLoading(true);
            const resultado = await obtenerDepartamento();
            
            if (resultado.exito) {
                const deptosAdaptados = resultado.data.map(dep => ({
                    id: dep.id,
                    nombre: dep.nombre,
                    descripcion: dep.descripcion,
                    jefeNombre: dep.nombreJefe || 'Sin jefe asignado', 
                    trabajadores: dep.totalEmpleados || 0, 
                    estado: dep.estado || (dep.activo ? 'Activo' : 'Inactivo') 
                }));
                setDepartamentos(deptosAdaptados);
            } else {
                console.error("Error al cargar departamentos");
            }
            setIsLoading(false);
        };

        cargarDepartamentos();
    }, []); 

    // Filtrado y Estadísticas
    const departamentosFiltrados = departamentos.filter(dept => {
        const coincideBusqueda = dept.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
                                dept.descripcion.toLowerCase().includes(busqueda.toLowerCase());
        const coincideEstado = filtroEstado === 'Todos' ? true : dept.estado === filtroEstado;
        return coincideBusqueda && coincideEstado;
    });

    const stats = {
        total: departamentos.length,
        activos: departamentos.filter(d => d.estado === 'Activo').length,
        inactivos: departamentos.filter(d => d.estado === 'Inactivo').length
    };

    // Handlers
    const handleAbrirCrear = () => {
        setDepartamentoAEditar(null);
        setFormData({ nombre: '', descripcion: '', jefeId: '' });
        setIsFormModalOpen(true);
    };

    const handleAbrirEditar = (dept) => {
        setDepartamentoAEditar(dept);
        setFormData({ nombre: dept.nombre, descripcion: dept.descripcion, jefeId: dept.jefeId || '' });
        setIsFormModalOpen(true);
    };

    const handleGuardarDepartamento = async (e) => {        
        e.preventDefault();
        setIsSaving(true);

        if (departamentoAEditar) {
            // 1. Limpiamos el jefeId
            const jefeIdLimpio = (formData.jefeId === "" || formData.jefeId === "0" || !formData.jefeId) 
                ? null 
                : Number(formData.jefeId);

            // 2. Solo llamamos al endpoint de asignar jefe
            const resultado = await asignarUnJefe(departamentoAEditar.id, jefeIdLimpio);

            if (resultado.exito) {
                const jefeSeleccionado = jefesDisponibles.find(j => j.id === jefeIdLimpio);
                const nombreJefeVisual = jefeSeleccionado ? jefeSeleccionado.nombreCompleto : 'Sin jefe asignado';

                setDepartamentos(prev => prev.map(dept => 
                    dept.id === departamentoAEditar.id 
                        ? { ...dept, jefeNombre: nombreJefeVisual, jefeId: jefeIdLimpio } 
                        : dept
                ));
                
                setFormData({ nombre: '', descripcion: '', jefeId: '' });
                setIsFormModalOpen(false);

                toast.success('Jefe asignado correctamente'); 
            } else {
                console.error("Falló la asignación del jefe");
                toast.error('Hubo un error al asignar al jefe');
            }
            setIsSaving(false);
        } else {
            // CREAR DEPARTAMENTO
            const jefeIdLimpio = (formData.jefeId === "" || formData.jefeId === "0" || !formData.jefeId) 
                ? null 
                : Number(formData.jefeId);

            const payload = {
                nombre: formData.nombre,
                descripcion: formData.descripcion,
                jefeId: jefeIdLimpio 
            };

            const resultado = await crearDepartamento(payload);

            if (resultado.exito) {
                const jefeSeleccionado = jefesDisponibles.find(j => j.id === jefeIdLimpio);
                const nombreJefeVisual = jefeSeleccionado ? jefeSeleccionado.nombreCompleto : (resultado.data?.nombreJefe || 'Sin jefe asignado');

                const nuevoDepto = {
                    id: resultado.data?.id || Math.random(), 
                    nombre: resultado.data?.nombre || formData.nombre,
                    descripcion: resultado.data?.descripcion || formData.descripcion,
                    jefeNombre: nombreJefeVisual,
                    trabajadores: resultado.data?.totalEmpleados || 0, 
                    estado: resultado.data?.estado || 'Activo'
                };

                setDepartamentos(prev => [...prev, nuevoDepto]);
                setFormData({ nombre: '', descripcion: '', jefeId: '' });
                setIsFormModalOpen(false);

                toast.success('Departamento creado exitosamente');
            } else {
                console.error("Falló la creación");
                toast.error('Hubo un error al crear el departamento');
            }
            setIsSaving(false);
        }
    };

    const handleToggleEstado = (dept) => {
        const nuevoEstado = dept.estado === 'Activo' ? 'Inactivo' : 'Activo';
        setConfirmModal({
            isOpen: true,
            title: `Confirmar ${nuevoEstado === 'Activo' ? 'activación' : 'desactivación'}`,
            message: `¿Estás seguro de que deseas ${nuevoEstado === 'Activo' ? 'activar' : 'desactivar'} el departamento de ${dept.nombre}?`,
            departamentoId: dept.id,
            nuevoEstado: nuevoEstado,
            type: nuevoEstado === 'Activo' ? 'success' : 'danger' 
        });
    };

    const ejecutarCambioEstado = () => {
        // TODO:  tarea Implementar llamada al backend para cambio de estado
        setDepartamentos(departamentos.map(d => 
            d.id === confirmModal.departamentoId ? { ...d, estado: confirmModal.nuevoEstado } : d
        ));
        setConfirmModal({ ...confirmModal, isOpen: false });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#0F2C59]">Gestión de Departamentos</h1>
                    <p className="text-sm sm:text-base text-gray-500 mt-1">Administra los departamentos y áreas de la empresa</p>
                </div>
                <div className='w-full sm:w-auto'>
                    <Button onClick={handleAbrirCrear} className="w-full sm:w-auto justify-center py-3 gap-2 bg-green-600 hover:bg-green-700">
                        <Plus size={20}  />
                        Nuevo Departamento
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <Card className="p-6 flex items-center gap-4 border-none shadow-sm">
                    <div className="bg-gray-200 p-3 rounded-lg">
                        <Building2 className="text-gray-600" size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Departamentos</p>
                        <p className="text-2xl sm:text-3xl font-bold text-[#0F2C59]">{stats.total}</p>
                    </div>
                </Card>

                <Card className="p-6 flex items-center gap-4 border-none shadow-sm">
                    <div className="bg-green-50 p-3 rounded-lg">
                        <CheckCircle className="text-green-600" size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Activos</p>
                        <p className="text-2xl sm:text-3xl font-bold text-green-600">{stats.activos}</p>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-red-50 p-3 rounded-lg">
                            <XCircle className="text-red-600" size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Inactivos</p>
                            <p className="text-2xl sm:text-3xl font-bold text-red-600">{stats.inactivos}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Search and Filters */}
            <Card className="p-4 sm:p-6 mb-6 flex flex-col gap-4 border-none shadow-sm bg-white">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <Input
                        type="text"
                        placeholder="Buscar por nombre o descripción..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="pl-10 w-full"
                    />
                </div>

                <div className="flex flex-col lg:flex-row gap-4 w-full justify-between lg:items-center">
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                    {[
                        { id: 'Todos', label: 'Todos', icon: null },
                        { id: 'Activo', label: 'Activos', icon: <CheckCircle size={18} /> },
                        { id: 'Inactivo', label: 'Inactivos', icon: <XCircle size={18} /> }
                    ].map((filtro) => (
                        <button
                            key={filtro.id}
                            onClick={() => setFiltroEstado(filtro.id)}
                            className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-4 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all border-2 ${
                                filtroEstado === filtro.id
                                ? 'bg-[#0F2C59] text-white border-[#0F2C59]'
                                : 'bg-white text-gray-700 border-[#0F2C59] hover:bg-gray-50'
                            }`}
                        >
                            {filtro.icon}
                            {filtro.label}
                        </button>
                    ))}
                    </div>
                </div>
            </Card>
            
            {/* Listado de Departamentos */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <Loader2 size={40} className="text-[#0F2C59] animate-spin mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Cargando departamentos...</h3>
                    <p className="text-gray-500">Por favor, espera un momento.</p>
                </div>
            ) : departamentosFiltrados.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Building2 size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">No se encontraron departamentos</h3>
                    <p className="text-gray-500">Intenta con otros filtros o términos de búsqueda</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {departamentosFiltrados.map((dept) => (
                        <Card key={dept.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300 border-gray-200 flex flex-col rounded-xl bg-white">
                            <div className="p-4 sm:p-5 flex-1">
                                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4 sm:mb-2">
                                    <div className="flex items-start gap-3 w-full md:w-auto flex-1">
                                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#0F2C59] rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-sm">
                                            <Building2 size={24} />
                                        </div>
                                        <div className="flex-1 min-w-0 w-full">
                                            <h3 className="text-lg font-bold text-[#0F2C59] truncate">{dept.nombre}</h3>
                                            
                                            <div className="flex flex-col gap-3 mt-2">
                                                <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                                                    {dept.descripcion}
                                                </p>
                                                
                                                <div className="flex flex-wrap items-center gap-3 mt-1">
                                                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 bg-gray-50 px-2.5 py-1.5 rounded-md border border-gray-200">
                                                        <UserCheck size={16} className="text-[#0F2C59]" />
                                                        <span className="font-semibold text-gray-700">Jefe:</span>
                                                        <span className="truncate max-w-[150px]">{dept.jefeNombre}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 bg-gray-50 px-2.5 py-1.5 rounded-md border border-gray-200">
                                                        <Users size={16} className="text-[#0F2C59]" />
                                                        <span className="font-semibold text-gray-700">Empleados:</span>
                                                        <span>{dept.trabajadores}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-row md:flex-col justify-between items-center md:items-end w-full md:w-auto gap-4 md:gap-3 mt-2 md:mt-0 flex-shrink-0">
                                        <span className={`px-3 py-1.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-medium flex items-center gap-1.5 border ${
                                            dept.estado === 'Activo' 
                                            ? 'bg-green-50 text-green-700 border-green-200' 
                                            : 'bg-red-50 text-red-700 border-red-200'
                                        }`}>
                                            {dept.estado === 'Activo' ? <Check size={14} /> : <XIcon size={14} />}
                                            {dept.estado}
                                        </span>
                                        
                                        <div className="flex gap-2 w-full sm:w-auto">
                                            <button
                                                onClick={() => handleAbrirEditar(dept)}
                                                className="flex-1 md:flex-none flex justify-center items-center gap-1.5 px-3 py-2 sm:py-1.5 border border-[#0F2C59] text-[#0F2C59] rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
                                                title="Editar"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            
                                            {dept.estado === 'Activo' ? (
                                                <button
                                                    onClick={() => handleToggleEstado(dept)}
                                                    className='flex items-center gap-1 px-4 py-2 sm:py-1.5 border border-red-600 text-red-600 rounded-md hover:bg-red-50 transition-colors font-medium text-sm'
                                                >
                                                    <XIcon size={16}/> Desactivar
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleToggleEstado(dept)}
                                                    className="flex items-center gap-1 px-4 py-2 sm:py-1.5 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors font-medium text-sm"
                                                >
                                                    <Check size={16}/> Activar
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Modales*/}
            <DepartamentoFormModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                onSubmit={handleGuardarDepartamento}
                isSaving={isSaving}
                departamentoAEditar={departamentoAEditar}
                formData={formData}
                setFormData={setFormData}
                jefesDisponibles={jefesDisponibles}
            />

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                onConfirm={ejecutarCambioEstado}
                title={confirmModal.title}
                message={confirmModal.message}
                type={confirmModal.type}
            />
        </div>
    );
}