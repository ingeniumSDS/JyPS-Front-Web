import React, { useState } from 'react';
import { Users, Search, Edit2, Mail, Phone, Building2, Plus } from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import CrearTrabajadorModal from '../../components/modals/CrearTrabajadorModal';
import EditarTrabajadorModal from '../../components/modals/EditarTrabajadorModal';

// Mock de departamentos 
const DEPARTAMENTOS_ACTIVOS = [
    { id: '1', nombre: 'Tecnologías de la Información' },
    { id: '2', nombre: 'Desarrollo de Software' },
    { id: '3', nombre: 'Recursos Humanos' },
    { id: '4', nombre: 'Administración' },
];

export default function JefeCrearTabajador() {
    // Estados de la vista
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Estados de los modales
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedTrabajador, setSelectedTrabajador] = useState(null);

    // Estado de los datos 
    const [trabajadores, setTrabajadores] = useState([
        {
        id: '1',
        nombre: 'Juan Pérez García',
        telefono: '7771234567',
        email: 'juan.perez@utez.edu.mx',
        departamento: 'Tecnologías de la Información',
        isActive: true
        },
        {
        id: '2',
        nombre: 'María Elena Sánchez',
        telefono: '7772341234',
        email: 'maria.sanchez@utez.edu.mx',
        departamento: 'Desarrollo de Software',
        isActive: true
        }
    ]);

    // Filtrado de trabajadores
    const filteredTrabajadores = trabajadores.filter(t =>
    t.isActive && (
            t.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (t.departamento && t.departamento.toLowerCase().includes(searchTerm.toLowerCase()))
        )
    );

    // Funciones abrir/cerrar modales
    const handleCloseModals = () => {
        setIsCreateModalOpen(false);
        setIsEditModalOpen(false);
        setSelectedTrabajador(null);
    };

    const handleOpenEdit = (trabajador) => {
        setSelectedTrabajador(trabajador);
        setIsEditModalOpen(true);
    };

    // NUEVO trabajador
    const handleCreateTrabajador = async (formData) => {
    setIsLoading(true);
    try {
        // Futurollamada a la API. 
        await new Promise(resolve => setTimeout(resolve, 1000));

        const nuevoTrabajador = {
            id: Date.now().toString(),
            ...formData,
            isActive: true
        };

        setTrabajadores(prev => [...prev, nuevoTrabajador]);
        alert('Trabajador creado exitosamente');
        handleCloseModals();
    } catch (error) {
        alert('Error al crear el trabajador');
    } finally {
        setIsLoading(false);
    }
    };

    // ACTUALIZAR un trabajador existente
    const handleEditTrabajador = async (formData) => {
    setIsLoading(true);
    try {
           // Futurollamada a la API.  
            await new Promise(resolve => setTimeout(resolve, 1000));
            setTrabajadores(prev => prev.map(t => 
            t.id === formData.id ? { ...t, ...formData } : t
            ));
        alert('Información actualizada correctamente');
        handleCloseModals();
        } catch (error) {
            alert('Error al actualizar la información');
        } finally {
            setIsLoading(false);
        }
    };

    return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F2C59] mb-2">
            Gestión de Trabajadores
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
            Administra los trabajadores asignados a tu área
            </p>
        </div>
        <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[#28A745] hover:bg-[#218838] w-full sm:w-auto text-white"
        >
            <Plus size={20} className="mr-2" />
            Crear Trabajador
        </Button>
        </div>

      {/* Estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card className="p-4 sm:p-6 border-l-4 border-[#0F2C59]">
            <div className="flex items-center gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users size={24} className="text-[#0F2C59]" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-gray-500 font-medium truncate uppercase tracking-wider">
                Total Trabajadores
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-[#0F2C59]">
                {trabajadores.length}
                </p>
            </div>
            </div>
        </Card>
        </div>

      {/* Buscador */}
        <Card className="p-4 sm:p-6 mb-6">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input
                type="text"
                placeholder="Buscar por nombre, email o departamento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
            />
        </div>
        </Card>

      {/* Lista de Trabajadores */}
        <div className="space-y-4">
        {filteredTrabajadores.length === 0 ? (
            <Card className="p-8 text-center bg-gray-50 border-dashed">
            <Users size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">
                {searchTerm ? 'No se encontraron trabajadores que coincidan con tu búsqueda.' : 'No tienes trabajadores asignados aún.'}
            </p>
            </Card>
        ) : (
            filteredTrabajadores.map((trabajador) => (
            <Card key={trabajador.id} className="p-4 sm:p-6 hover:shadow-md transition-all duration-200 border border-gray-100">
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                
                {/* Info del Trabajador */}
                <div className="flex items-start sm:items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#0F2C59] flex items-center justify-center flex-shrink-0 shadow-inner">
                    <span className="text-white font-bold text-lg">
                        {trabajador.nombre.charAt(0).toUpperCase()}
                    </span>
                    </div>

                    <div>
                    <h3 className="font-bold text-lg text-[#0F2C59]">
                        {trabajador.nombre}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium border border-blue-100">
                        <Building2 size={12} />
                        {trabajador.departamento}
                        </span>
                    </div>
                    </div>
                </div>

                {/* Contacto y Acciones */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={14} className="text-gray-400" />
                        {trabajador.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={14} className="text-gray-400" />
                        {trabajador.telefono}
                    </div>
                    </div>

                    <Button
                        variant="outline"
                        onClick={() => handleOpenEdit(trabajador)}
                        className="w-full sm:w-auto text-[#0F2C59] border-gray-200 hover:bg-gray-50 whitespace-nowrap"
                    >
                    <Edit2 size={16} className="mr-2" />
                    Editar
                    </Button>
                </div>

                </div>
            </Card>
            ))
        )}
        </div>

      {/* Instancia de los Modales */}
        <CrearTrabajadorModal
            isOpen={isCreateModalOpen}
            onClose={handleCloseModals}
            onSubmit={handleCreateTrabajador}
            departamentos={DEPARTAMENTOS_ACTIVOS}
            isLoading={isLoading}
        />

        <EditarTrabajadorModal
            isOpen={isEditModalOpen}
            onClose={handleCloseModals}
            onSubmit={handleEditTrabajador}
            trabajador={selectedTrabajador}
            departamentos={DEPARTAMENTOS_ACTIVOS}
            isLoading={isLoading}
        />
    </div>
    );
}