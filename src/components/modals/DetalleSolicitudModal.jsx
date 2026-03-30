import React from 'react';
import { X, User, Calendar, Paperclip, Check, X as XIcon } from 'lucide-react';

const DetalleSolicitudModal = ({ isOpen, onClose, solicitud }) => {
  if (!isOpen || !solicitud) return null;

  // Determine colors and styles based on status
  const statusStyles = {
    Aprobado: 'bg-green-100 text-green-700',
    Pendiente: 'bg-yellow-100 text-yellow-700',
    Rechazado: 'bg-red-100 text-red-700',
  };

  const isJustificante = solicitud.tipo === 'Justificante';
  const isPending = solicitud.estado === 'Pendiente';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-slate-800">
            Detalle de {isJustificante ? 'Justificante' : 'Pase de Salida'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto custom-scrollbar flex-1">
          
          {/* Status Row */}
          <div className="flex items-center justify-start mb-6">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[solicitud.estado] || statusStyles.Pendiente}`}>
              {solicitud.estado}
            </span>
          </div>

          {/* Employee Information Card */}
          <div className="bg-slate-50 rounded-lg p-4 mb-4 border border-slate-100">
            <div className="flex items-center gap-2 mb-3 text-slate-700 font-semibold">
              <User size={18} />
              <h3>Información del Trabajador</h3>
            </div>
            <div className="text-sm text-slate-600 space-y-1 ml-6">
              <p><span className="font-bold text-slate-800">Nombre:</span> {solicitud.nombre}</p>
              <p><span className="font-bold text-slate-800">Email:</span> {solicitud.email}</p>
            </div>
          </div>

          {/* Details Card */}
          <div className="bg-slate-50 rounded-lg p-4 mb-4 border border-slate-100">
            <div className="flex items-center gap-2 mb-3 text-slate-700 font-semibold">
              <Calendar size={18} />
              <h3>Detalles</h3>
            </div>
            <div className="text-sm text-slate-600 space-y-2 ml-6">
              <p><span className="font-bold text-slate-800">Fecha:</span> {solicitud.fecha}</p>
              
              {/* Only show time if it's a pass */}
              {!isJustificante && solicitud.horaSalida && (
                <p><span className="font-bold text-slate-800">Hora de salida:</span> {solicitud.horaSalida}</p>
              )}
              
              <div>
                <span className="font-bold text-slate-800 block mb-1">Motivo:</span>
                <div className="bg-white border border-slate-200 rounded p-2 text-slate-700">
                  {solicitud.motivo}
                </div>
              </div>
            </div>
          </div>

          {/* Evidence (Only for Justificantes) */}
          {isJustificante && solicitud.evidencia && (
            <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-100 flex items-center gap-3">
              <Paperclip size={18} className="text-blue-600" />
              <div>
                <h4 className="text-sm font-bold text-blue-800 mb-0.5">Evidencia adjunta</h4>
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  {solicitud.evidencia}
                </a>
              </div>
            </div>
          )}

          {/* Resolution Blocks (Approved/Rejected) */}
          {!isPending && solicitud.estado === 'Aprobado' && (
            <div className="bg-green-50 rounded-lg p-4 mb-2 border border-green-200 text-sm">
              <span className="font-bold text-green-800">Aprobado por:</span> <span className="text-green-700">{solicitud.revisadoPor}</span>
            </div>
          )}

          {!isPending && solicitud.estado === 'Rechazado' && (
            <div className="bg-red-50 rounded-lg p-4 mb-2 border border-red-200 text-sm">
              <span className="font-bold text-red-800 block mb-1">Motivo de rechazo:</span>
              <span className="text-red-700">{solicitud.motivoRechazo}</span>
            </div>
          )}

        </div>

        {/* Modal Footer (Action Buttons) */}
        <div className="p-5 border-t border-gray-100 mt-auto bg-white">
          {isPending ? (
            // Action Buttons for Pending Requests
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => {
                  console.log('Aprobar solicitud', solicitud.id);
                  onClose();
                }}
                className="flex items-center justify-center gap-2 py-2 px-4 bg-[#28a745] hover:bg-[#218838] text-white font-semibold rounded-lg transition-colors"
              >
                <Check size={18} />
                Aprobar
              </button>
              <button 
                onClick={() => {
                  console.log('Rechazar solicitud', solicitud.id);
                  onClose();
                }}
                className="flex items-center justify-center gap-2 py-2 px-4 bg-white border border-[#dc3545] text-[#dc3545] hover:bg-red-50 font-semibold rounded-lg transition-colors"
              >
                <XIcon size={18} />
                Rechazar
              </button>
            </div>
          ) : (
            // Close Button for Processed Requests
            <button 
              onClick={onClose}
              className="w-full py-2 px-4 bg-white border-2 border-slate-800 text-slate-800 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cerrar
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default DetalleSolicitudModal;