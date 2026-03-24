import React from 'react';
import { X, AlertCircle, CheckCircle } from 'lucide-react'; 

const ConfirmModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    type = 'danger',
    confirmText 
}) => {
    if (!isOpen) return null;
    
    //Color dinamico
    const iconBgColor = type === 'danger' ? 'bg-red-100' : 'bg-green-100';
    const iconColor = type === 'danger' ? 'text-red-600' : 'text-green-600';
    const confirmBtnColor = type === 'danger' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white';

    //Icono dinamico
    const IconComponent = type === 'danger' ? AlertCircle : CheckCircle;
    const defaultConfirmText = type === 'danger' ? 'Desactivar' : 'Activar';
    const buttonText = confirmText || defaultConfirmText;

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
        <div className="flex flex-col gap-4 mb-8">
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full flex-shrink-0 ${iconBgColor} ${iconColor}`}>
                    <IconComponent size={28} />
                </div>
                <p className="text-slate-600 text-lg">{message}</p>
            </div>
        </div>

        {/* Footer (Botones) */}
        <div className="flex gap-3 w-full mt-6 pt-4">
            <button 
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 bg-white border border-[#0F2C59] text-[#0F2C59] border-2 hover:bg-[#0F2C59] hover:text-white font-medium rounded-lg transition-colors"
            >
                Cancelar
            </button>
    
            <button 
                type="button"
                onClick={onConfirm}
                className={`flex-1 px-4 py-2.5 font-medium rounded-lg transition-colors flex justify-center items-center gap-2 ${confirmBtnColor}`}
            >
                {buttonText}
            </button>
            </div>

        </div>
    </div>
    );
};

export default ConfirmModal;