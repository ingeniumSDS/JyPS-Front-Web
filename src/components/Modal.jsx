import { useEffect } from "react";
import { X } from "lucide-react";

export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
   // Bloqueamos el scrol del fondo
    useEffect(()=>{
        if(isOpen){
            document.body.style.overflow = 'hidden';
        }else{
            document.body.style.overflow = 'unset';
        }return()=> {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    // Responsivo
    const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
    };

    return (
    // Fondo oscuro semi-transparente
    <div className="fixed inset-0 z-50 overflow-y-auto">
        <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity cursor-pointer"
        onClick={onClose}
        />

      {/* Contenedor del Modal */}
        <div className="flex min-h-full items-center justify-center p-4">
        <div className={`relative bg-white rounded-2xl shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200`}>

          {/* (Title y botón X) */}
            {title && (
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
                <h2 className="text-xl font-bold text-[#0F2C59]">{title}</h2>
                <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                title="Cerrar"
                >
                <X size={20} />
                </button>
            </div>
            )}

          {/* Contenido */}
            <div className="p-4 sm:p-6 overflow-y-auto">
            {children}
            </div>

        </div>
        </div>
    </div>
   );
}