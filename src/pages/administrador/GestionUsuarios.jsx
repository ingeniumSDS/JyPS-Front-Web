import React, { useState, useEffect } from 'react';
import { Users, Search, Edit2, UserCheck, UserX, Building2, Phone, Mail, Plus, Check, X as XIcon } from 'lucide-react';
import { useGestion } from '../../hooks/useGestion';

import ConfirmModal from '../../components/modals/ConfirmModal';
import { CrearUsuarioModal } from '../../components/modals/CrearUsuarioModal';
import { Card } from '../../components/Card'; 
import { Button } from '../../components/Button'; 
import { Input } from '../../components/Input';
import { toast } from 'sonner'; 

// --- UTILIDADES GLOBALES ---
const obtenerColorRol = (rol) => {
    const rolNormalizado = String(rol).toLowerCase();
    switch (rolNormalizado) {
        case 'administrador':
        case 'admin':
            return 'bg-red-200 text-red-700';
        case 'jefe_de_departamento':
        case 'jefe':
            return 'bg-purple-200 text-purple-700';
        case 'auditor':
        case 'rh':
            return 'bg-green-200 text-green-700';
        case 'empleado':
        case 'usuario':
            return 'bg-blue-200 text-blue-700';
        case 'guardia': 
        case 'seguridad':
            return 'bg-amber-200 text-amber-700';
        default:
            return 'bg-slate-100 text-slate-700';
    }
};

export default function GestionUsuarios() {
    
    // --- ESTADOS ---
    const [usuarios, setUsuarios] = useState([]);
    const [departamentosDb, setDepartamentosDb] = useState([]);
    const [isCargandoInicial, setIsCargandoInicial] = useState(true);

    const [busqueda, setBusqueda] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('todos'); 
    const [filtroDepartamento, setFiltroDepartamento] = useState('todos');

    const [visibleCount, setVisibleCount] = useState(5);

    const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
    const [usuarioAEditar, setUsuarioAEditar] = useState(null);
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        usuarioId: null,
        accion: '', 
        title: '',
        message: '',
        type: 'success'
    });

    const { crearUsuario, obtenerUsuarios, obtenerDepartamento, actualizarUsuario, cambiarEstadoUsuario } = useGestion();

    const cargarDatosIniciales = async () => {
        setIsCargandoInicial(true);
        const [resUsuarios, resDepartamentos] = await Promise.all([
            obtenerUsuarios(),
            obtenerDepartamento()
        ]);
        
        if (resUsuarios.exito) setUsuarios(resUsuarios.data);
        else console.error("Error al cargar usuarios"); 

        if (resDepartamentos.exito) setDepartamentosDb(resDepartamentos.data);
        else console.error("Error al cargar departamentos"); 

        setIsCargandoInicial(false);
    };

    useEffect(() => {
        cargarDatosIniciales();
    }, []);

    // la cantidad visible a 5 
    useEffect(() => {
        setVisibleCount(5);
    }, [busqueda, filtroEstado, filtroDepartamento]);

    const handleAbrirEditar = (usuario) => {
        setUsuarioAEditar(usuario); 
        setIsCrearModalOpen(true);  
    };

    const handleCerrarCrearModal = () => {
        setIsCrearModalOpen(false);
        setUsuarioAEditar(null);
    };

    const handleGuardarUsuario = async (formData, id) => {
        if (id) {
            const response = await actualizarUsuario(id, formData);
            if (response.exito) {
                toast.success("¡Usuario actualizado con éxito!");
                handleCerrarCrearModal();
                cargarDatosIniciales(); 
            } else {
                toast.error("Error al actualizar ");
            }
        } else {
            const response = await crearUsuario(formData);
            if (response.exito) {
                toast.success("¡Usuario creado con éxito!");
                handleCerrarCrearModal(); 
                cargarDatosIniciales(); 
            } else {
                toast.error("Error al crear");
            }
        }
    };

    const handleToggleEstado = (usuario) => {
        const estaActivo = usuario.isActive; 
        setConfirmModal({
            isOpen: true,
            usuarioId: usuario.id,
            accion: estaActivo ? 'desactivar' : 'activar',
            title: estaActivo ? 'Confirmar Desactivación' : 'Confirmar Activación',
            message: estaActivo 
                ? '¿Estás seguro de que quieres desactivar esta cuenta?' 
                : '¿Estás seguro de que quieres reactivar esta cuenta?',
            type: estaActivo ? 'danger' : 'success'
        });
    };

    const ejecutarCambioEstado = async () => {
        try {
            const nuevoEstado = confirmModal.accion === 'activar' ? true : false;
            const response = await cambiarEstadoUsuario(confirmModal.usuarioId, nuevoEstado);

            if (response.exito) {
                toast.success(`¡Usuario ${confirmModal.accion === 'activar' ? 'activado' : 'desactivado'} con éxito!`);
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
                cargarDatosIniciales(); 
            } else {
                toast.error("Error al cambiar el estado");
            }
        } catch (error) {
            console.error("Error al cambiar el estado");
            toast.error("Ocurrió un error inesperado al cambiar el estado");
        }
    };

    const obtenerNombreDepto = (usuario) => {
        const id = usuario.departamentoId || parseInt(String(usuario.departamento).replace(/\D/g, ''), 10);
        if (id) {
            const deptoEncontrado = departamentosDb.find(d => d.id === id);
            if (deptoEncontrado) return deptoEncontrado.nombre;
        }
        return usuario.departamento || 'Sin departamento';
    };

    const departamentosNombres = departamentosDb.map(d => d.nombre);
    
    const totalUsuarios = usuarios.length;
    const usuariosActivos = usuarios.filter(u => u.isActive).length;
    const usuariosInactivos = totalUsuarios - usuariosActivos;

    const usuariosFiltrados = usuarios.filter(usuario => {
        const coincideBusqueda = 
            usuario.nombreCompleto.toLowerCase().includes(busqueda.toLowerCase()) || 
            usuario.email.toLowerCase().includes(busqueda.toLowerCase()) ||
            usuario.rol.toLowerCase().includes(busqueda.toLowerCase());
            
        const coincideEstado = 
            filtroEstado === 'todos' ? true : 
            filtroEstado === 'activos' ? usuario.isActive : !usuario.isActive;

        const coincideDepto = 
            filtroDepartamento === 'todos' ? true :
            obtenerNombreDepto(usuario) === filtroDepartamento;
            
        return coincideBusqueda && coincideEstado && coincideDepto;
    });

    // Cortamos el arreglo para mostrar a 5
    const usuariosPaginados = usuariosFiltrados.slice(0, visibleCount);

    if (isCargandoInicial) {
        return <div className="flex justify-center items-center h-64 text-[#0F2C59] font-semibold">Cargando información...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Encabezado y Acción Principal */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#0F2C59]">Gestión de Usuarios</h1>
                    <p className="text-sm sm:text-base text-gray-600 mt-1">Administrar usuarios del sistema</p>
                </div>
                <div className="w-full sm:w-auto">
                    <Button onClick={() => setIsCrearModalOpen(true)} fullWidth={false} className="w-full sm:w-auto justify-center py-3 gap-2 bg-green-600 hover:bg-green-700">
                        <Plus size={20} />
                        <span>Crear Usuario</span> 
                    </Button>
                </div>
            </div>

            {/* Tarjetas de Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <Card className="p-6 flex items-center gap-4 border-none shadow-sm">
                    <div className="bg-gray-200 p-3 rounded-lg"><Users size={24} className='text-gray-600'/></div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Usuarios</p>
                        <p className="text-2xl sm:text-3xl font-bold text-[#0F2C59]">{totalUsuarios}</p>
                    </div>
                </Card>
                
                <Card className="p-6 flex items-center gap-4 border-none shadow-sm">
                    <div className="p-3 bg-green-50 text-green-600 rounded-lg"><UserCheck size={24} /></div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Usuarios Activos</p>
                        <p className="text-2xl sm:text-3xl font-bold text-green-600">{usuariosActivos}</p>
                    </div>
                </Card>

                <Card className="p-6 flex items-center gap-4 border-none shadow-sm">
                    <div className="p-3 bg-red-50 text-red-600 rounded-lg"><UserX size={24} /></div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Usuarios Inactivos</p>
                        <p className="text-2xl sm:text-3xl font-bold text-red-600">{usuariosInactivos}</p>
                    </div>
                </Card>
            </div>

            {/* Barra de Búsqueda y Filtros */}
            <Card className="p-4 sm:p-6 mb-6 flex flex-col gap-4 border-none shadow-sm bg-white">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <Input
                        type="text"
                        placeholder="Buscar por nombre, correo o rol..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F2C59]/20 focus:border-[#0F2C59]"
                    />
                </div>
                
                <div className="flex flex-col lg:flex-row gap-4 w-full justify-between lg:items-center">
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                        {[
                            { id: 'todos', label: 'Todos', icon: null },
                            { id: 'activos', label: 'Activos', icon: <UserCheck size={18} /> },
                            { id: 'inactivos', label: 'Inactivos', icon: <UserX size={18} /> }
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
                    
                    <select
                        value={filtroDepartamento}
                        onChange={(e) => setFiltroDepartamento(e.target.value)}
                        className="w-full lg:w-auto px-4 py-3 sm:py-2 bg-white border-2 border-[#0F2C59] rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F2C59]/20 focus:border-[#0F2C59] cursor-pointer"
                    >
                        <option value="todos">Todos los departamentos</option>
                        {departamentosNombres.map(depto => (
                            <option key={depto} value={depto}>{depto}</option>
                        ))}
                    </select>
                </div>
            </Card>

            {/* Listado de Usuarios */}
            <div className="grid grid-cols-1 gap-6">
                {usuariosPaginados.map((usuario) => (
                    <Card key={usuario.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300 border-gray-200 flex flex-col rounded-xl">
                        <div className="p-4 sm:p-5 flex-1">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4 sm:mb-2">
                                <div className="flex items-start gap-3 w-full md:w-auto">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#0F2C59] rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                                        {usuario.nombreCompleto.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-bold text-[#0F2C59] truncate">{usuario.nombreCompleto}</h3>
                                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                            <span className={`px-3 py-1 border text-xs font-medium rounded-full capitalize whitespace-nowrap ${obtenerColorRol(usuario.rol)}`}>
                                                {usuario.rol.replace(/_/g, ' ')}
                                            </span>
                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full whitespace-nowrap">
                                                <Building2 size={14} className="text-gray-500" />
                                                <span>{obtenerNombreDepto(usuario)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-row md:flex-col justify-between items-center md:items-end w-full md:w-auto gap-4 md:gap-3 mt-2 md:mt-0">
                                    <span className={`px-3 py-1.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-medium flex items-center gap-1.5 border ${
                                        usuario.isActive 
                                        ? 'bg-green-50 text-green-700 border-green-200' 
                                        : 'bg-red-50 text-red-700 border-red-200'
                                    }`}>
                                        {usuario.isActive ? <UserCheck size={14} /> : <UserX size={14} />}
                                        {usuario.isActive ? 'Activo' : 'Inactivo'}
                                    </span>
                                    <div className="flex gap-2 w-full sm:w-auto">
                                        <button
                                            onClick={() => handleAbrirEditar(usuario)}
                                            className="flex-1 md:flex-none flex justify-center items-center gap-1.5 px-3 py-2 sm:py-1.5 border border-[#0F2C59] text-[#0F2C59] rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
                                            title="Editar"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        {usuario.isActive ? (
                                            <button
                                                onClick={() => handleToggleEstado(usuario)}
                                                className='flex-1 md:flex-none flex justify-center items-center gap-1 px-4 py-2 sm:py-1.5 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium'
                                            >
                                                <XIcon size={16}/> Desactivar
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleToggleEstado(usuario)}
                                                className="flex-1 md:flex-none flex justify-center items-center gap-1 px-4 py-2 sm:py-1.5 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors text-sm font-medium"
                                            >
                                                <Check size={16}/> Activar
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-9 mt-4 pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-2.5 text-sm text-gray-600 w-full sm:w-auto">
                                    <Mail size={16} className="text-gray-400 flex-shrink-0" />
                                    <span className="truncate">{usuario.email}</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-sm text-gray-600 w-full sm:w-auto">
                                    <Phone size={16} className="text-gray-400 flex-shrink-0" />
                                    <span>{usuario.telefono || 'Sin teléfono'}</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/*Boton de Cargar mas*/}
            {visibleCount < usuariosFiltrados.length && (
                <div className="flex justify-center mt-6">
                    <Button 
                        onClick={() => setVisibleCount(prev => prev + 5)} 
                        className="bg-white border-1 border-[#0F2C59] text-[#0F2C59]  font-semibold px-8 py-2 rounded-xl transition-colors"
                    >
                        Cargar más usuarios
                    </Button>
                </div>
            )}
            
            {/* Estado Vacío */}
            {usuariosFiltrados.length === 0 && !isCargandoInicial && (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">No se encontraron usuarios</h3>
                    <p className="text-gray-500">Intenta con otros filtros o términos de búsqueda</p>
                </div>
            )}

            {/* --- MODALES --- */}
            <CrearUsuarioModal 
                isOpen={isCrearModalOpen}
                onClose={handleCerrarCrearModal}
                onSubmit={handleGuardarUsuario}
                departamentos={departamentosDb}
                usuarioAEditar={usuarioAEditar}
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