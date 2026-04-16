import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Loader2, FileText, X } from 'lucide-react';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useIncidencias } from '../../hooks/useIncidencias';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

export default function SolicitarPase() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { crearPaseSalida, isSavingPase } = useIncidencias();

  // --- Estados de Formulario ---
  const [formData, setFormData] = useState({
  fecha: new Date().toLocaleDateString('en-CA'), 
  horaSalida: '',
  detalles: ''
});
  const [detallesError, setDetallesError] = useState('');
  const [archivos, setArchivos] = useState([]);

  // --- Estado para bloquear el botón ---
  const [isSubmitting, setIsSubmitting] = useState(false); 

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
    if (isSubmitting) return;

    if (!user?.id || !user?.departamentoId) return toast.error('Sesión incompleta.');

    setIsSubmitting(true);

    try {
        const hoyReal = new Date().toLocaleDateString('en-CA');
        const fechaHoraISO =`${hoyReal}T${formData.horaSalida}:00`; 

        // OBJETO PLANO 
        const objetoPase = {
            empleadoId: Number(user.id), 
            nombreCompleto: `${user.nombre} ${user.apellidoPaterno || ''}`.trim(),
            jefeId: Number(user.departamentoId), 
            horaSolicitada: fechaHoraISO,
            fechaSolicitud: hoyReal,
            descripcion: formData.detalles,
            estado: "PENDIENTE",
            comentario: "",
            QR: ""
        };

        // objeto y los archivos 
        const resultado = await crearPaseSalida(objetoPase, archivos);

        if (resultado.exito) {
            toast.success('Pase solicitado correctamente');
            navigate(-1);
        } else {
            toast.error(resultado.mensaje );
            setIsSubmitting(false);
        }
    } catch (error) {
        toast.error('Error de conexión');
        setIsSubmitting(false);
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
            <Input label="Nombre Completo" value={`${user?.nombre} ${user?.apellidoPaterno || ''} ${user.apellidoMaterno || ''}`} disabled className="bg-gray-50" />
            <Input label="Departamento" value={user?.nombreDepartamento || ''} disabled className="bg-gray-50" />
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

          

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button type="button" variant="outline" fullWidth onClick={() => navigate(-1)} disabled={isSubmitting}>Cancelar</Button>
            <Button type="submit" fullWidth disabled={isSubmitting || isSavingPase || !user?.departamentoId}>
              {isSubmitting || isSavingPase ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Procesando...</>
              ) : 'Enviar Solicitud'}
            </Button>
          </div>
        </form>
      </Card>

      <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
        <p className="text-xs text-blue-800">
          <strong>Nota:</strong> Tu solicitud será enviada al jefe de tu departamento ({user?.nombreDepartamento || 'asignado'}) para su aprobación.
        </p>
      </div>
    </div>
  );
}