import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Loader2, FileText, X } from 'lucide-react';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useApi } from '../../hooks/useApi';
import { useIncidencias } from '../../hooks/useIncidencias';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

export default function SolicitarPase() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { request } = useApi();
  const { crearPaseSalida, isSavingPase } = useIncidencias();

  // --- Estados de Formulario ---
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    horaSalida: '',
    detalles: ''
  });
  const [detallesError, setDetallesError] = useState('');
  const [archivos, setArchivos] = useState([]);

  // --- Estados de Carga y Validación ---
  const [jefeId, setJefeId] = useState(null);
  const [cargandoJefe, setCargandoJefe] = useState(true);

  // --- Efectos: Búsqueda automática del jefe ---
  useEffect(() => {
    const obtenerJefe = async () => {
      try {
        setCargandoJefe(true);
        const departamentos = await request('/departamentos', 'GET');
        const miDepto = departamentos.find(
          d => d.nombre === user?.departamento || d.id === user?.departamentoId
        );

        if (miDepto?.jefeId) {
          setJefeId(miDepto.jefeId);
        } else {
          toast.error("Tu departamento no tiene un jefe asignado.");
        }
      } catch (error) {
        toast.error("Error al cargar información del jefe");
      } finally {
        setCargandoJefe(false);
      }
    };

    if (user) obtenerJefe();
  }, [user, request]);

  // --- Handlers de Eventos ---
  const handleDetallesChange = (e) => {
    const val = e.target.value;
    setFormData({ ...formData, detalles: val });
    
    if (val.length > 0 && val.length < 25) setDetallesError('Mínimo 25 caracteres');
    else if (val.length > 255) setDetallesError('Máximo 255 caracteres');
    else setDetallesError('');
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setArchivos(prev => [...prev, ...selectedFiles]);
  };

  const eliminarArchivo = (index) => {
    setArchivos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!jefeId) return toast.error('No hay un jefe asignado a tu departamento.');
    if (formData.detalles.length < 25) return toast.error('Descripción demasiado corta.');

    const fechaHora = new Date(`${formData.fecha}T${formData.horaSalida}`).toISOString();

    const datosPase = {
      empleadoId: user?.id,
      jefeId: jefeId,
      horaSolicitada: fechaHora,
      fechaSolicitud: formData.fecha,
      descripcion: formData.detalles,
      estado: "PENDIENTE"
    };

    const resultado = await crearPaseSalida(datosPase, archivos);

    if (resultado.exito) {
      toast.success('Pase solicitado correctamente');
      navigate(-1);
    } else {
      toast.error(resultado.mensaje || 'Error al procesar la solicitud');
    }
  };

  return (
    <div className="pb-8 max-w-3xl mx-auto animate-fade-in px-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} className="text-[#0F2C59]" />
        </button>
        <h1 className="text-xl sm:text-2xl font-bold text-[#0F2C59]">Solicitar Pase de Salida</h1>
      </div>

      <Card className="p-4 sm:p-8 border-t-4 border-t-[#0F2C59]">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Datos del Usuario */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Nombre Completo" value={user?.nombre || ''} disabled className="bg-gray-50" />
            <Input label="Correo Institucional" value={user?.email || ''} disabled className="bg-gray-50" />
          </div>

          {/* Tiempo */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Input type="date" label="Fecha" value={formData.fecha} disabled className="bg-gray-50" />
            <Input type="time" label="Hora de Salida" value={formData.horaSalida} onChange={(e) => setFormData({...formData, horaSalida: e.target.value})} required />
          </div>

          {/* Motivo */}
          <div>
            <label className="block mb-2 font-medium text-gray-700 text-sm">Detalles del Pase *</label>
            <textarea
              className={`w-full p-3 text-sm border rounded-lg focus:ring-2 outline-none transition-colors resize-none ${detallesError ? 'border-red-500' : 'border-gray-300'}`}
              rows={3}
              placeholder="Motivo y destino..."
              value={formData.detalles}
              onChange={handleDetallesChange}
              required
            />
            <div className="flex justify-between mt-1">
              <p className="text-xs text-gray-400">Incluye motivo y hora estimada de regreso</p>
              <p className={`text-xs font-medium ${formData.detalles.length < 25 ? 'text-red-500' : 'text-gray-500'}`}>{formData.detalles.length}/255</p>
            </div>
          </div>

          {/* Recuadro de Archivos Compacto */}
          <div>
            <label className="block mb-2 font-medium text-gray-700 text-sm">Evidencia (Opcional)</label>
            
            <div className="border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 p-3 transition-all">
              
              {archivos.length === 0 ? (
                /* ESTADO VACÍO: Todo el recuadro es clicleable para subir */
                <label className="flex flex-col items-center justify-center py-4 cursor-pointer hover:bg-gray-100 rounded-md">
                  <Upload className="w-6 h-6 mb-2 text-gray-400" />
                  <p className="text-xs text-gray-500 text-center">
                    <span className="font-semibold text-[#0F2C59]">Haz clic para subir</span><br />
                    PDF, JPG o PNG
                  </p>
                  <input 
                    type="file" 
                    className="hidden" 
                    multiple 
                    accept=".pdf,image/*"
                    onChange={handleFileChange} 
                  />
                </label>
              ) : (
                /* ESTADO CON ARCHIVOS: El scroll y la X funcionan porque el input ya no estorba */
                <div className="space-y-2">
                  {/* Contenedor de lista con scroll real */}
                  <div className="max-h-32 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
                    {archivos.map((archivo, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between bg-white p-2 rounded border border-gray-200 text-xs shadow-sm"
                      >
                        <div className="flex items-center gap-2 truncate text-[#0F2C59] flex-1">
                          <FileText size={14} className="flex-shrink-0" />
                          <span className="truncate">{archivo.name}</span>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => eliminarArchivo(index)}
                          className="ml-2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          title="Eliminar archivo"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Botón pequeño para agregar más, separado de la lista */}
                  <label className="flex items-center justify-center gap-2 py-2 mt-2 border-t border-gray-200 cursor-pointer hover:text-[#0F2C59] transition-colors">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">+ Agregar más</span>
                    <input 
                      type="file" 
                      className="hidden" 
                      multiple 
                      accept=".pdf,image/*"
                      onChange={handleFileChange} 
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button type="button" variant="outline" fullWidth onClick={() => navigate(-1)}>Cancelar</Button>
            <Button type="submit" fullWidth disabled={isSavingPase || cargandoJefe || !jefeId}>
              {isSavingPase || cargandoJefe ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Procesando...</>
              ) : 'Enviar Solicitud'}
            </Button>
          </div>
        </form>
      </Card>

      <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
        <p className="text-xs text-blue-800">
          <strong>Nota:</strong> Tu solicitud será enviada al jefe de departamento para su aprobación.
        </p>
      </div>
    </div>
  );
}