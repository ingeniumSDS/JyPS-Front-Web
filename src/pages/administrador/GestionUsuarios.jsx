import { useState } from 'react';
import { Users, Search, Edit2, UserCheck, UserX, Building2, Phone, Mail, Plus } from 'lucide-react';
import { Card } from '../../components/Card'; 
import { Button } from '../../components/Button'; 

// Datos falsos para probar el diseño
const MOCK_USERS = [
    { id: '1', nombre: 'Juan Pérez', email: 'juan@jyps.com', rol: 'guardia', departamento: 'Seguridad', telefono: '5512345678', isActive: true },
    { id: '2', nombre: 'María García', email: 'maria@jyps.com', rol: 'recursos_humanos', departamento: 'Recursos Humanos', telefono: '5587654321', isActive: true },
    { id: '3', nombre: 'Carlos López', email: 'carlos@jyps.com', rol: 'trabajador', departamento: 'Sistemas', telefono: '5511223344', isActive: false },
];

export default function GestionUsuarios() {
    const [usuarios, setUsuarios] = useState(MOCK_USERS);
    const [busqueda, setBusqueda] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('todos'); 
    const [filtroDepartamento, setFiltroDepartamento] = useState('todos');

    const departamentosUnicos = [...new Set(usuarios.map(u => u.departamento))];

    const totalUsuarios = usuarios.length;
    const usuariosActivos = usuarios.filter(u => u.isActive).length;
    const usuariosInactivos = totalUsuarios - usuariosActivos;

    const usuariosFiltrados = usuarios.filter(usuario => {
        const coincideBusqueda = 
            usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
            usuario.email.toLowerCase().includes(busqueda.toLowerCase()) ||
            usuario.rol.toLowerCase().includes(busqueda.toLowerCase());
            
        const coincideEstado = 
            filtroEstado === 'todos' ? true : 
            filtroEstado === 'activos' ? usuario.isActive : !usuario.isActive;

        const coincideDepto = 
            filtroDepartamento === 'todos' ? true :
            usuario.departamento === filtroDepartamento;
            
        return coincideBusqueda && coincideEstado && coincideDepto;
    });

    return (
    <div className="space-y-6">
        {/* HEADER Y BOTÓN */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h1 className="text-2xl font-bold text-[#0F2C59]">Gestión de Usuarios</h1>
                <p className="text-gray-600 mt-1">Administrar usuarios del sistema</p>
            </div>
            <div className="w-full sm:w-auto">
                <Button fullWidth={false} className="w-full sm:w-auto justify-center py-3 gap-2 bg-green-600 hover:bg-green-700">
                    <Plus size={20} />
                    <span>Crear Usuario</span>
                </Button>
            </div>
        </div>

        {/* ESTADÍSTICAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <Card className="p-6 flex items-center gap-4 border-none shadow-sm">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Users size={24} /></div>
                <div>
                    <p className="text-sm text-gray-500 font-medium">Total Usuarios</p>
                    <p className="text-2xl font-bold text-[#0F2C59]">{totalUsuarios}</p>
                </div>
            </Card>
            
            <Card className="p-6 flex items-center gap-4 border-none shadow-sm">
                <div className="p-3 bg-green-50 text-green-600 rounded-lg"><UserCheck size={24} /></div>
                <div>
                    <p className="text-sm text-gray-500 font-medium">Usuarios Activos</p>
                    <p className="text-2xl font-bold text-[#0F2C59]">{usuariosActivos}</p>
                </div>
            </Card>

            <Card className="p-6 flex items-center gap-4 border-none shadow-sm">
                <div className="p-3 bg-red-50 text-red-600 rounded-lg"><UserX size={24} /></div>
                <div>
                    <p className="text-sm text-gray-500 font-medium">Usuarios Inactivos</p>
                    <p className="text-2xl font-bold text-[#0F2C59]">{usuariosInactivos}</p>
                </div>
            </Card>
        </div>

        {/* BÚSQUEDA Y FILTROS */}
        <Card className="p-4 flex flex-col gap-4 border-none shadow-sm bg-white">
            {/* Buscador */}
            <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Buscar por nombre, correo o rol..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F2C59]/20 focus:border-[#0F2C59]"
                />
            </div>
            
            <div className="flex flex-col lg:flex-row gap-4 w-full justify-between lg:items-center">
                {/* Botones de Estado */}
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
                {/* SELECT DE DEPARTAMENTO */}
                <select
                    value={filtroDepartamento}
                    onChange={(e) => setFiltroDepartamento(e.target.value)}
                    className="w-full lg:w-auto px-4 py-3 sm:py-2 bg-white border-2 border-[#0F2C59] rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F2C59]/20 focus:border-[#0F2C59] cursor-pointer"
                >
                    <option value="todos">Todos los departamentos</option>
                    {departamentosUnicos.map(depto => (
                        <option key={depto} value={depto}>{depto}</option>
                    ))}
                </select>
            </div>
        </Card>

        {/* LISTA DE USUARIOS */}
        <div className="grid grid-cols-1 gap-6">
            {usuariosFiltrados.map((usuario) => (
                <Card key={usuario.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300 border-gray-200 flex flex-col rounded-xl">
                    <div className="p-4 sm:p-5 flex-1">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4 sm:mb-2">
                            <div className="flex items-start gap-3 w-full md:w-auto">
                                {/* Avatar */}
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#0F2C59] rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                                    {usuario.nombre.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-bold text-[#0F2C59] truncate">{usuario.nombre}</h3>
                                    {/* Rol y Departamento*/}
                                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full capitalize whitespace-nowrap">
                                            {usuario.rol.replace('_', ' ')}
                                        </span>
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full whitespace-nowrap">
                                            <Building2 size={14} className="text-gray-500" />
                                            <span>{usuario.departamento || 'Sin departamento'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-row md:flex-col justify-between items-center md:items-end w-full md:w-auto gap-4 md:gap-3 mt-2 md:mt-0">
                                {/* Estado */}
                                <span className={`px-3 py-1.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-medium flex items-center gap-1.5 border ${
                                    usuario.isActive 
                                    ? 'bg-green-50 text-green-700 border-green-200' 
                                    : 'bg-red-50 text-red-700 border-red-200'
                                }`}>
                                    {usuario.isActive ? <UserCheck size={14} /> : <UserX size={14} />}
                                    {usuario.isActive ? 'Activo' : 'Inactivo'}
                                </span>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <button className="flex-1 md:flex-none flex justify-center items-center gap-1.5 px-3 py-2 sm:py-1.5 border border-[#0F2C59] text-[#0F2C59] rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
                                        <Edit2 size={16} />
                                        Editar
                                    </button>
                                    <button className={`flex-1 md:flex-none flex justify-center items-center gap-1.5 px-3 py-2 sm:py-1.5 border rounded-lg text-sm font-medium transition-colors ${
                                        usuario.isActive 
                                        ? 'border-red-500 text-red-600 hover:bg-red-50' 
                                        : 'border-green-500 text-green-600 hover:bg-green-50'
                                    }`}>
                                        {usuario.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
                                        {usuario.isActive ? 'Desactivar' : 'Activar'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* INFORMACIÓN DE CONTACTO */}
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
        
        {/* Mensaje si no hay resultados */}
        {usuariosFiltrados.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No se encontraron usuarios</h3>
                <p className="text-gray-500">Intenta con otros filtros o términos de búsqueda</p>
            </div>
        )}
    </div>
    );
}