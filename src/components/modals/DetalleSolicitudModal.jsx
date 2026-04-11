import React, { useEffect, useState } from 'react';
import { X, User, Calendar, Paperclip, Check, X as XIcon, Loader2, Mail } from 'lucide-react';
import { useIncidencias } from '../../hooks/useIncidencias';
import { toast } from 'sonner';

const DetalleSolicitudModal = ({ isOpen, onClose, solicitud, onActualizacion }) => {
  const { obtenerDetalleIncidencia, revisarIncidencia } = useIncidencias();
  
  const [detalle, setDetalle] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [enviando, setEnviando] = useState(false);

    useEffect(() => {
      const cargarInfoCompleta = async () => {
        if (isOpen && solicitud?.id) {
          setCargando(true);
          try {
            const data = await obtenerDetalleIncidencia(solicitud.id, solicitud.tipo);
            setDetalle(data);
          } catch (error) {
            toast.error("No se pudo obtener la información detallada.");
          } finally {
            setCargando(false);
          }
        }
      };

      cargarInfoCompleta();
      if (!isOpen) setDetalle(null);
      
    }, [isOpen, solicitud]);

  if (!isOpen || !solicitud) return null;

  const info = detalle || solicitud;
  // Normalizamos
  const tipoNormalizado = solicitud.tipo?.toLowerCase();
  const esJustificante = solicitud?.tipo?.toLowerCase().includes('justificante');
  const esPendiente = solicitud.estado?.toUpperCase() === 'PENDIENTE';

    const handleAccion = async (nuevoEstado) => {
      let motivo = "";
      
      if (nuevoEstado === 'RECHAZADO') {
          motivo = prompt("Ingrese el motivo del rechazo:");
          if (motivo === null) return;
          if (motivo.trim() === "") return toast.error("Debe indicar un motivo para rechazar");
      } else {
          motivo = "Aprobado por el jefe";
      }

      setEnviando(true);
      try {
          await revisarIncidencia({
              id: solicitud.id, 
              tipo: solicitud.tipo,
              estado: nuevoEstado,
              comentario: motivo 
          });
          
          toast.success(`Solicitud ${nuevoEstado.toLowerCase()} exitosamente`);
          onActualizacion(); 
          onClose();
      } catch (error) {
          toast.error("Error al procesar la solicitud en el servidor.");
      } finally {
          setEnviando(false);
      }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
        
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-[#0F2C59]">
            Detalle de {esJustificante ? 'Justificante' : 'Pase de Salida'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 relative">
          {cargando && (
            <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
              <Loader2 className="animate-spin text-[#0F2C59]" size={32} />
            </div>
          )}

          <div className="flex items-center justify-start mb-6">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase 
              ${solicitud.estado?.toUpperCase() === 'APROBADO' ? 'bg-green-100 text-green-700' : 
                solicitud.estado?.toUpperCase() === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-700' : 
                'bg-red-100 text-red-700'}`}>
              {solicitud.estado}
            </span>
          </div>

          {/* Información del Trabajador */}
          <div className="bg-slate-50 rounded-lg p-4 mb-4 border border-slate-100">
            <div className="flex items-center gap-2 mb-3 text-slate-700 font-semibold">
              <User size={18} />
              <h3>Información del Trabajador</h3>
            </div>
            <div className="text-sm text-slate-600 space-y-1 ml-6">
              <p><span className="font-bold text-slate-800">Nombre:</span> {info.nombreCompleto || info.nombre || '...'}</p>
              {/* Añadimos email si el detalle lo trae */}
              {info.email && (
                <p><span className="font-bold text-slate-800">Email:</span> {info.email}</p>
              )}
            </div>
          </div>

          {/* Detalles de la Solicitud */}
          <div className="bg-slate-50 rounded-lg p-4 mb-4 border border-slate-100">
            <div className="flex items-center gap-2 mb-3 text-slate-700 font-semibold">
              <Calendar size={18} />
              <h3>Detalles de la Fecha</h3>
            </div>
            <div className="text-sm text-slate-600 space-y-2 ml-6">
              <p><span className="font-bold text-slate-800">Fecha solicitada:</span> {info.fechaSolicitada || info.fecha}</p>
              
              {!esJustificante && info.horaSolicitada && (
                <p><span className="font-bold text-slate-800">Hora de salida:</span> {info.horaSolicitada}</p>
              )}
              
              <div>
                <span className="font-bold text-slate-800 block mb-1">Motivo / Descripción:</span>
                <div className="bg-white border border-slate-200 rounded p-3 text-slate-700 italic">
                  "{info.descripcion || info.motivo || 'Sin descripción'}"
                </div>
              </div>
            </div>
          </div>

          {/* Evidencias (image_503485.png muestra que 'archivos' es un array) */}
          {esJustificante && info.archivos && info.archivos.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-100">
               <div className="flex items-center gap-2 mb-2 text-blue-800 font-semibold">
                <Paperclip size={18} />
                <h4>Evidencia Adjunta</h4>
              </div>
              <div className="ml-6 space-y-1">
                {info.archivos.map((archivo, idx) => (
                  <a key={idx} href={archivo} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline block truncate">
                    {archivo.split('/').pop() || `Documento ${idx + 1}`}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-5 border-t border-gray-100 bg-gray-50">
          {esPendiente ? (
            <div className="grid grid-cols-2 gap-3">
              <button 
                disabled={enviando || cargando}
                onClick={() => handleAccion('APROBADO')}
                className="flex items-center justify-center gap-2 py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-all disabled:opacity-50"
              >
                {enviando ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                Aprobar
              </button>
              <button 
                disabled={enviando || cargando}
                onClick={() => handleAccion('RECHAZADO')}
                className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white border-2 border-red-500 text-red-500 hover:bg-red-50 font-bold rounded-lg transition-all disabled:opacity-50"
              >
                <XIcon size={18} />
                Rechazar
              </button>
            </div>
          ) : (
            <button 
              onClick={onClose}
              className="w-full py-2.5 px-4 bg-[#0F2C59] text-white font-bold rounded-lg hover:bg-[#1a3a6e] transition-all"
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