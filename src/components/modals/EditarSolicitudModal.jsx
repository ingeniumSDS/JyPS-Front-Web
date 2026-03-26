import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Modal } from '../Modal'; 
import { Input } from '../Input';
import { Button } from '../Button';

export default function EditarSolicitudModal({ isOpen, onClose, solicitud, onSave }) {
    const [formData, setFormData] = useState({
        fecha: '',
        horaSalida: '',
        motivo: ''
    });

    useEffect(() => {
    if (solicitud) {
        setFormData({
            fecha: solicitud.fecha || '',
            horaSalida: solicitud.horaSalida || '',
            motivo: solicitud.motivo || ''
        });
    }
    }, [solicitud]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...solicitud, ...formData });
        onClose();
    };

    return (
    <Modal isOpen={isOpen} onClose={onClose}>
        <div className="bg-white w-full max-w-md overflow-hidden rounded-xl">
        
        {/* Encabezado */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
            <h2 className="text-xl font-bold text-blue-950">
            Editar {solicitud?.tipo === 'pase' ? 'Pase de Salida' : 'Justificante'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} strokeWidth={2.5} />
            </button>
        </div>

        {/* Cuerpo del Formulario */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5">

            <Input 
                label="Fecha"
                type="date" 
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                required
            className="w-full"
            />

            {solicitud?.tipo === 'pase' && (
                <Input 
                label="Hora de Salida"
                type="time" 
                name="horaSalida"
                value={formData.horaSalida}
                onChange={handleChange}
                required
                className="w-full"
                />
            )}

            <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Motivo <span className="text-red-500">*</span>
            </label>
            <textarea 
                value={formData.motivo}
                onChange={handleChange}
                rows="3"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                required
            ></textarea>
            </div>

          {/* Footer / Botones */}
            <div className="flex gap-3 pt-2">
            <Button 
                type="button" 
                onClick={onClose}
                variant="outline"
                className="flex-1 py-2.5 border-blue-950 text-blue-950 font-semibold hover:bg-blue-50"
            >
                Cancelar
            </Button>
            <Button 
                type="submit" 
                className="flex-1 py-2.5 bg-[#2ea64e] hover:bg-[#258a40] text-white font-semibold border-none shadow-sm"
            >
                Guardar Cambios
            </Button>
            </div>
        </form>

        </div>
    </Modal>
  );
}