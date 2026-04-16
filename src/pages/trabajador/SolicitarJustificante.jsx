import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { ArrowLeft, Upload, FileText, X, Loader2 } from 'lucide-react';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useIncidencias } from '../../hooks/useIncidencias';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

// --- Helpers de Fechas (Corregidos a Días Hábiles) ---
const calcularFechaMinima = () => {
    const fechaActual = new Date();
    let diasHabilesContados = 0;

    while (diasHabilesContados < 3) {
        fechaActual.setDate(fechaActual.getDate() - 1);
        if (fechaActual.getDay() !== 0 && fechaActual.getDay() !== 6) {
            diasHabilesContados++;
        }
    }
    const offset = fechaActual.getTimezoneOffset() * 60000;
    return new Date(fechaActual.getTime() - offset).toISOString().split('T')[0];
};

const calcularFechaMaxima = () => {
    const hoy = new Date();
    const offset = hoy.getTimezoneOffset() * 60000;
    return new Date(hoy.getTime() - offset).toISOString().split('T')[0];
};

export default function SolicitarJustificante() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { solicitarJustificante, isLoadingRequest } = useIncidencias();

    // --- Estados ---
    const [formData, setFormData] = useState({ fecha: '', detalles: '' });
    const [archivos, setArchivos] = useState([]);
    const [detallesError, setDetallesError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); 

    // --- Handlers ---
    
    //Validacion sabado/domingazo
    const handleFechaChange = (e) => {
        const valor = e.target.value;
        if (!valor) {
            setFormData({ ...formData, fecha: '' });
            return;
        }

        //horaria 
        const fechaSeleccionada = new Date(valor + 'T00:00:00');
        const dia = fechaSeleccionada.getDay();

        if (dia === 0 || dia === 6) {
            toast.error('No puedes justificar sábados ni domingos. Selecciona un día hábil.');
            setFormData({ ...formData, fecha: '' }); 
        } else {
            setFormData({ ...formData, fecha: valor });
        }
    };

    const handleDetallesChange = (e) => {
        const value = e.target.value;
        setFormData({ ...formData, detalles: value });
        if (value.length > 0 && value.length < 25) setDetallesError('Mínimo 25 caracteres');
        else if (value.length > 255) setDetallesError('Máximo 255 caracteres');
        else setDetallesError('');
    };

    const handleFileChange = (e) => {
        const seleccionados = Array.from(e.target.files);
        setArchivos(prev => [...prev, ...seleccionados]);
    };

    const eliminarArchivo = (index) => {
        setArchivos(prev => prev.filter((_, i) => i !== index));
    };

    // --- Lógica de Bloqueo de Botón ---
    const estaCargando = isLoadingRequest || isSubmitting;
    
    const botonBloqueado = 
        estaCargando || 
        !formData.fecha || 
        formData.detalles.length < 25 || 
        archivos.length === 0 || 
        !user?.departamentoId;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (botonBloqueado) return;

        setIsSubmitting(true);

        const datosPayload = {
            empleadoId: Number(user?.id),
            nombreCompleto: `${user?.nombre} ${user?.apellidoPaterno || ''}`.trim(),
            jefeId: Number(user?.departamentoId), 
            fechaSolicitud: new Date().toISOString().split('T')[0], 
            fechaSolicitada: formData.fecha, 
            descripcion: formData.detalles,
            estado: "PENDIENTE",
            comentario: "" 
        };

        try {
            const resultado = await solicitarJustificante(datosPayload, archivos);

            if (resultado.exito) {
                toast.success('¡Justificante enviado correctamente!');
                navigate(-1, { replace: true }); 
            } else {
                toast.error('Error al enviar el justificante');
                setIsSubmitting(false); 
            }
        } catch (error) {
            toast.error('Ocurrió un error inesperado.');
            setIsSubmitting(false); 
        }
    };

    return (
        <div className="pb-8 max-w-3xl mx-auto animate-fade-in px-4">
            <div className="flex items-center gap-3 mb-6">
                <button 
                    type="button" 
                    onClick={() => navigate(-1)} 
                    disabled={estaCargando}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30"
                >
                    <ArrowLeft size={20} className="text-[#0F2C59]"/>
                </button>
                <h1 className="text-xl sm:text-2xl font-bold text-[#0F2C59]">Solicitar Justificante</h1>
            </div>

            <Card className="p-4 sm:p-8 border-t-4 border-t-[#28A745]">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <Input label="Nombre Completo" value={`${user?.nombre} ${user?.apellidoPaterno || ''} ${user?.apellidoMaterno || ''}`} disabled className="bg-gray-50" />
                        <Input label="Departamento" value={user?.nombreDepartamento || 'Sin asignar'} disabled className="bg-gray-50" />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <Input
                                type="date"
                                label="Fecha de Inasistencia"
                                value={formData.fecha}
                                onChange={handleFechaChange} // Reemplazado por el nuevo handler
                                required
                                disabled={estaCargando}
                                min={calcularFechaMinima()}
                                max={calcularFechaMaxima()}
                            />
                            <p className="mt-1 text-[10px] text-gray-500 uppercase">Límite: 3 días hábiles previos.</p>
                        </div>
                    </div>

                    <div>
                        <label className="block mb-2 font-medium text-gray-700 text-sm">Motivo de Inasistencia *</label>
                        <textarea
                            className={`w-full p-3 text-sm border rounded-lg focus:ring-2 outline-none transition-colors resize-none ${detallesError ? 'border-red-500' : 'border-gray-300'} ${estaCargando ? 'bg-gray-50 opacity-70' : ''}`}
                            rows={4}
                            placeholder="Describe detalladamente el motivo..."
                            value={formData.detalles}
                            onChange={handleDetallesChange}
                            required
                            disabled={estaCargando}
                        />
                        <div className="flex justify-between mt-1">
                            <p className="text-xs text-gray-400">{detallesError || 'Detalla tu situación para agilizar la aprobación.'}</p>
                            <p className={`text-xs font-medium ${formData.detalles.length < 25 ? 'text-red-500' : 'text-gray-500'}`}>{formData.detalles.length}/255</p>
                        </div>
                    </div>

                    <div>
                        <label className="block mb-2 font-medium text-gray-700 text-sm">Evidencia / Receta (Requerido) *</label>
                        <div className={`border-2 border-gray-200 border-dashed rounded-lg bg-gray-50 p-3 transition-all ${estaCargando ? 'opacity-50 pointer-events-none' : ''}`}>
                            {archivos.length === 0 ? (
                                <label className="flex flex-col items-center justify-center py-4 cursor-pointer hover:bg-gray-100 rounded-md">
                                    <Upload className="w-6 h-6 mb-2 text-gray-400" />
                                    <p className="text-xs text-gray-500"><span className="font-semibold text-[#28A745]">Haz clic para adjuntar</span></p>
                                    <input type="file" className="hidden" multiple accept=".pdf,image/*" onChange={handleFileChange} />
                                </label>
                            ) : (
                                <div className="space-y-2">
                                    <div className="max-h-32 overflow-y-auto pr-1 space-y-2">
                                        {archivos.map((archivo, index) => (
                                            <div key={index} className="flex items-center justify-between bg-white p-2 rounded border border-gray-200 text-xs shadow-sm">
                                                <div className="flex items-center gap-2 truncate text-[#0F2C59]">
                                                    <FileText size={14} className="text-[#28A745]" />
                                                    <span className="truncate max-w-[150px]">{archivo.name}</span>
                                                </div>
                                                <button 
                                                    type="button" 
                                                    onClick={() => eliminarArchivo(index)} 
                                                    className="text-red-500 p-1 hover:bg-red-50 rounded"
                                                    disabled={estaCargando}
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <label className="flex items-center justify-center py-2 mt-2 border-t border-gray-100 cursor-pointer text-[10px] font-bold text-blue-600 uppercase">
                                        + Agregar más evidencia
                                        <input type="file" className="hidden" multiple accept=".pdf,image/*" onChange={handleFileChange} />
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button 
                            type="button" 
                            variant="outline" 
                            fullWidth 
                            onClick={() => navigate(-1)}
                            disabled={estaCargando}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            type="submit" 
                            fullWidth 
                            disabled={botonBloqueado}
                            className="bg-[#28A745] hover:bg-[#218838] text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {estaCargando ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Enviando solicitud...</>
                            ) : (
                                'Enviar Solicitud'
                            )}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}