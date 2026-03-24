import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Paperclip, Camera, X } from 'lucide-react';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

// Funcion fecha minima 
const calcularFechaMinima = () => {
    const hoy = new Date();
    let diasHabilesContados = 0;
    let fechaActual = new Date(hoy);

    while (diasHabilesContados < 3) {
    fechaActual.setDate(fechaActual.getDate() - 1);
    const diaSemana = fechaActual.getDay();
    // dias habiles
    if (diaSemana !== 0 && diaSemana !== 6) {
        diasHabilesContados++;
    }
    }

    const year = fechaActual.getFullYear();
    const month = String(fechaActual.getMonth() + 1).padStart(2, '0');
    const day = String(fechaActual.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Funcion fecha maxima 
const calcularFechaMaxima = () => {
    const ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);

    const year = ayer.getFullYear();
    const month = String(ayer.getMonth() + 1).padStart(2, '0');
    const day = String(ayer.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export default function SolicitarJustificante() {
    const navigate = useNavigate(); 
  // Simulacion del usuario 
    const user = { 
    nombre: "Juan Pérez García", 
    email: "juan.perez@utez.edu.mx" 
    };

    const [formData, setFormData] = useState({
    fecha: '',
    detalles: ''
    });
    const [archivos, setArchivos] = useState([]);
    const [detallesError, setDetallesError] = useState('');

    const handleDetallesChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, detalles: value });
    
    // Validar longitud
    if (value.length > 0 && value.length < 25) {
        setDetallesError('Debe tener al menos 25 caracteres');
    } else if (value.length > 255) {
        setDetallesError('No puede exceder 255 caracteres');
    } else {
        setDetallesError('');
    }
    };

    const handleFileUpload = (e) => {
    const files = e.target.files;
    if (files) {
        const nuevosArchivos = Array.from(files);
        setArchivos([...archivos, ...nuevosArchivos]);
    }
    };

    const handleCameraCapture = () => {
        alert('Función de cámara estará disponible en dispositivos móviles próximamente.');
    };

    const removeFile = (index) => {
    const nuevosArchivos = archivos.filter((_, i) => i !== index);
    setArchivos(nuevosArchivos);
    };

    const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar antes de enviar
    if (formData.detalles.length < 25) {
        setDetallesError('Debe tener al menos 25 caracteres');
        alert('Los detalles del justificante deben tener al menos 25 caracteres');
        return;
    }
    
    if (formData.detalles.length > 255) {
        setDetallesError('No puede exceder 255 caracteres');
        alert('Los detalles del justificante no pueden exceder 255 caracteres');
        return;
    }
    
    alert('¡Justificante enviado correctamente!');
    
    // Por ahora 
    navigate('/trabajador');
    };

    return (
    <div className="pb-6 sm:pb-8 max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <button 
            onClick={() => navigate('/trabajador')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
        >
            <ArrowLeft size={20} className="text-[#0F2C59] sm:w-6 sm:h-6" />
        </button>
        <h1 className="text-xl sm:text-2xl font-bold text-[#0F2C59] break-words">Solicitar Justificante</h1>
        </div>

      {/* Form */}
        <Card className="p-4 sm:p-6 md:p-8 border-t-4 border-t-[#28A745]">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Información del Trabajador */}
            <div className="grid sm:grid-cols-2 gap-4">
            <Input
                label="Nombre Completo"
                value={user.nombre}
                disabled
                className="bg-gray-50 text-gray-500"
            />
            <Input
                label="Correo Institucional"
                value={user.email}
                disabled
                className="bg-gray-50 text-gray-500"
            />
            </div>

          {/* Fecha */}
            <div className="grid sm:grid-cols-2 gap-4">
            <div>
                <Input
                type="date"
                label="Fecha de Inasistencia"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                required
                min={calcularFechaMinima()}
                max={calcularFechaMaxima()}
                />
                <p className="mt-1 text-xs text-gray-500">
                Límite: 3 días hábiles previos a hoy.
                </p>
            </div>
            </div>

          {/* Detalles */}
            <div>
            <label className="block mb-2 font-medium text-gray-700 text-sm sm:text-base">
                Detalles del Justificante <span className="text-red-500">*</span>
            </label>
            <textarea
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border rounded-lg focus:ring-2 outline-none transition-colors resize-none ${
                detallesError 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-100' 
                    : 'border-gray-300 focus:border-[#0F2C59] focus:ring-blue-100'
                }`}
                rows={4}
                placeholder="Describe el motivo de tu inasistencia con detalle (enfermedad, emergencia familiar, cita médica, etc.)..."
                value={formData.detalles}
                onChange={handleDetallesChange}
                required
                maxLength={255}
            />
            <div className="flex justify-between items-start mt-1">
                <p className="text-xs text-gray-500">
                Proporciona detalles para agilizar la aprobación
                </p>
                <p className={`text-xs font-medium ${
                formData.detalles.length < 25 
                    ? 'text-red-500' 
                    : formData.detalles.length > 200 
                    ? 'text-yellow-600' 
                    : 'text-gray-500'
                }`}>
                {formData.detalles.length}/255
                </p>
            </div>
            {detallesError && <p className="mt-1 text-sm text-red-500">{detallesError}</p>}
            </div>

          {/* Archivos Adjuntos */}
            <div>
            <label className="block mb-2 font-medium text-gray-700 text-sm sm:text-base">
                Archivos Adjuntos (Recomendado)
            </label>
            <div className="flex gap-3">
                <label className="flex-1 cursor-pointer">
                <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#28A745] hover:bg-green-50/50 transition-colors">
                    <Paperclip size={20} className="text-gray-500" />
                    <span className="text-sm text-gray-600">
                    Adjuntar evidencia
                    </span>
                </div>
                <input
                    type="file"
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx"
                    multiple
                    onChange={handleFileUpload}
                />
                </label>
                
                <button
                type="button"
                onClick={handleCameraCapture}
                className="px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#28A745] hover:bg-green-50/50 transition-colors"
                title="Tomar foto"
                >
                <Camera size={20} className="text-gray-500" />
                </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
                Receta médica, comprobante de cita, etc.
            </p>

            {/* Lista de archivos adjuntos */}
            {archivos.length > 0 && (
                <div className="mt-3 space-y-2">
                {archivos.map((archivo, index) => (
                    <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg animate-fade-in"
                    >
                    <div className="flex items-center gap-2 overflow-hidden">
                        <Paperclip size={16} className="text-[#28A745] flex-shrink-0" />
                        <span className="text-sm text-green-800 truncate">{archivo.name}</span>
                        <span className="text-xs text-green-600 flex-shrink-0">
                        ({(archivo.size / 1024).toFixed(1)} KB)
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="p-1 hover:bg-green-200 rounded-md transition-colors flex-shrink-0 ml-2"
                    >
                        <X size={16} className="text-green-700" />
                    </button>
                    </div>
                ))}
                </div>
            )}
            </div>

          {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={() => navigate('/trabajador')}
            >
                Cancelar
            </Button>
            <Button
                type="submit"
                fullWidth
                className="bg-[#28A745] hover:bg-[#218838] text-white"
            >
                Enviar Solicitud
            </Button>
            </div>
        </form>
        </Card>

      {/* Info */}
        <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-lg flex items-start gap-3">
        <p className="text-sm text-green-800">
            <strong>Tip:</strong> Adjuntar evidencia (receta médica, comprobante, etc.) acelera significativamente el proceso de aprobación.
        </p>
        </div>
    </div>
  );
}