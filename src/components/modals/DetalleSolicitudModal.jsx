import React, { useEffect, useState } from 'react';
import { X, User, Calendar, Paperclip, Check, X as XIcon, Loader2, Download } from 'lucide-react';
import { useIncidencias } from '../../hooks/useIncidencias';
import { toast } from 'sonner';

const DetalleSolicitudModal = ({ isOpen, onClose, solicitud, onActualizacion }) => {
  const { obtenerDetalleIncidencia, revisarIncidencia, descargarArchivoJustificante } = useIncidencias();
  
  const [detalle, setDetalle] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const [mostrandoRechazo, setMostrandoRechazo] = useState(false);
  const [motivoRechazo, setMotivoRechazo] = useState("");

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
    
    if (!isOpen) {
      setDetalle(null);
      setMostrandoRechazo(false);
      setMotivoRechazo("");
    }
  }, [isOpen, solicitud]);

  if (!isOpen || !solicitud) return null;

  const info = detalle || solicitud;
  const esJustificante = solicitud?.tipo?.toLowerCase().includes('justificante');
  const esPendiente = solicitud.estado?.toUpperCase() === 'PENDIENTE';

  const handleAccion = async (nuevoEstado) => {
      let motivo = "";
      
      if (nuevoEstado === 'RECHAZADO') {
          if (motivoRechazo.trim().length < 25) {
              return toast.error("El motivo de rechazo debe tener al menos 25 caracteres.");
          }
          motivo = motivoRechazo;
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

  // Funcion descarga 
  const handleDescargarArchivo = async (archivoUrl) => {
    if (!archivoUrl) return;
    try {
      await descargarArchivoJustificante(archivoUrl);
      toast.success("Descarga completada");
    } catch (error) {
      toast.error("Error al intentar descargar el archivo.");
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

          <div className="bg-slate-50 rounded-lg p-4 mb-4 border border-slate-100">
            <div className="flex items-center gap-2 mb-3 text-slate-700 font-semibold">
              <User size={18} />
              <h3>Información del Trabajador</h3>
            </div>
            <div className="text-sm text-slate-600 space-y-1 ml-6">
              <p><span className="font-bold text-slate-800">Nombre:</span> {info.nombreCompleto || info.nombre || '...'}</p>
              {info.email && (
                <p><span className="font-bold text-slate-800">Email:</span> {info.email}</p>
              )}
            </div>
          </div>

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

          {esJustificante && info.archivos && info.archivos.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-100">
                <div className="flex items-center gap-2 mb-2 text-blue-800 font-semibold">
                <Paperclip size={18} />
                <h4>Evidencia Adjunta</h4>
              </div>
              <div className="ml-6 space-y-2">
                {solicitud.archivos && solicitud.archivos.length > 0 && (
                  <div className="mb-4 border-t border-gray-100 pt-3">
                      <div className="flex flex-wrap gap-2">
                          {solicitud.archivos.map((archivo, idx) => {
                const refArchivo = typeof archivo === 'string' 
                    ? archivo 
                    : (archivo.urlDescarga || archivo.nombreOriginal);

                const nombreMostrar = refArchivo ? refArchivo.split('/').pop() : 'Archivo adjunto';

                return (
                    <button
                        key={idx}
                        type="button"
                        onClick={() => handleDescargarArchivo(refArchivo)} // Corrección 2: Evento onClick activo
                        className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-md border bg-gray-50 text-blue-700 border-gray-200 hover:bg-blue-50 transition-colors"
                    >
                        <Download size={14} />
                        <span className="truncate max-w-[150px]">{nombreMostrar}</span>
                    </button>
                );
            })}
        </div>
    </div>
)}
              </div>
            </div>
          )}
        </div>

        <div className="p-5 border-t border-gray-100 bg-gray-50">
          {esPendiente ? (
            mostrandoRechazo ? (
              <div className="flex flex-col gap-3 w-full animate-in fade-in slide-in-from-bottom-4">
                <textarea
                  autoFocus
                  value={motivoRechazo}
                  onChange={(e) => setMotivoRechazo(e.target.value)}
                  placeholder="Escribe el motivo del rechazo detallado (mínimo 25 caracteres)..."
                  className="w-full p-3 text-sm border border-black  rounded-lg focus:ring-2  focus:outline-none resize-none"
                  rows="3"
                />
                {/* Corrección 1: Clases dinámicas dependiendo de la longitud del texto */}
                <div className={`flex justify-between items-center text-xs px-1 transition-colors duration-200 ${motivoRechazo.trim().length >= 25 ? 'text-green-600 font-bold' : 'text-gray-500'}`}>
                  <span>{motivoRechazo.length} / 25 caracteres mínimos</span>
                </div>
                <div className="flex gap-2 justify-end mt-2">
                  <button 
                    disabled={enviando}
                    onClick={() => {
                        setMostrandoRechazo(false);
                        setMotivoRechazo("");
                    }}
                    className="px-4 py-2 text-gray-600 font-semibold hover:bg-gray-200 rounded-lg transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    disabled={enviando || motivoRechazo.trim().length < 25}
                    onClick={() => handleAccion('RECHAZADO')}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {enviando ? <Loader2 className="animate-spin" size={18} /> : <XIcon size={18} />}
                    Confirmar Rechazo
                  </button>
                </div>
              </div>
            ) : (
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
                  onClick={() => setMostrandoRechazo(true)}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white border-2 border-red-500 text-red-500 hover:bg-red-50 font-bold rounded-lg transition-all disabled:opacity-50"
                >
                  <XIcon size={18} />
                  Rechazar
                </button>
              </div>
            )
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