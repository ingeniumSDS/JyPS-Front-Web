import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/Modal';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { NombreInput } from '../../components/NombreInput';

const EditarTrabajadorModal = ({ isOpen, onClose, onSubmit, trabajador, departamentos = [], isLoading = false }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        telefono: '',
        email: '',
        departamento: ''
    });

    // Pre-llenar los datos 
    useEffect(() => {
    if (trabajador) {
        setFormData({
        nombre: trabajador.nombre || '',
        telefono: trabajador.telefono || '',
        email: trabajador.email || '',
        departamento: trabajador.departamento || ''
        });
    }
    }, [trabajador]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ ...trabajador, ...formData });
    };

    return (
    <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Editar Información del Trabajador"
    >
        <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre completo *
            </label>
            <NombreInput
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Nombre completo"
                disabled={isLoading}
                required
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
            Teléfono *
            </label>
            <Input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                placeholder="777 123 4567"
                disabled={isLoading}
                maxLength={12}
                required
            />
            <p className="text-xs text-gray-500 mt-1">
            Formato: 777 123 4567 (código de área + número)
            </p>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
            Email institucional *
            </label>
            <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="usuario@utez.edu.mx"
                disabled={isLoading}
                required
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
            Departamento *
            </label>
            <select
                name="departamento"
                value={formData.departamento}
                onChange={handleInputChange}
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-colors duration-200 outline-none bg-white focus:border-[#0F2C59] focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
            >
            <option value="">Seleccionar departamento</option>
            {departamentos.map(dept => (
                <option key={dept.id} value={dept.nombre}>
                {dept.nombre}
                </option>
            ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
            El trabajador será reasignado al departamento seleccionado
            </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t mt-6">
            <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1 justify-center"
                disabled={isLoading}
            >
            Cancelar
            </Button>
            <Button
                type="submit"
                className="flex-1 bg-[#28A745] hover:bg-[#218838] justify-center"
                disabled={isLoading}
            >
            {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
        </div>

        </form>
    </Modal>
    );
};

export default EditarTrabajadorModal;