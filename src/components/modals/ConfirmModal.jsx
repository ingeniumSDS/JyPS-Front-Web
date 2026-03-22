import React from 'react';
import { X, AlertCircle } from 'lucide-react';
import {Button} from '../Button'; 

const ConfirmModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    type = 'danger' 
}) => {
    if (!isOpen) return null;

    const iconBgColor = type === 'danger' ? 'bg-red-100' : 'bg-green-100';
    const iconColor = type === 'danger' ? 'text-red-600' : 'text-green-600';
    const confirmBtnColor = type === 'danger' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white';

    return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative animate-fade-in-up">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
            <h3 className="text-xl font-bold text-slate-800">{title}</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
            </button>
        </div>

        {/* Body */}
        <div className="flex items-center gap-4 mb-8">
            <div className={`p-3 rounded-full flex-shrink-0 ${iconBgColor} ${iconColor}`}>
            <AlertCircle size={28} />
            </div>
            <p className="text-slate-600 text-lg">{message}</p>
        </div>

        {/* Footer (Botones) */}
        <div className="flex justify-end gap-3">
          {/* Asumo que tu componente Button acepta className para inyectar estilos extra */}
            <Button 
            variant="outline" 
            onClick={onClose}
            className="border-slate-800 text-slate-800 hover:bg-slate-50"
            >
            Cancelar
            </Button>
            <button 
            onClick={onConfirm}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${confirmBtnColor}`}
            >
            Confirmar
            </button>
        </div>
        </div>
    </div>
    );
};

export default ConfirmModal;