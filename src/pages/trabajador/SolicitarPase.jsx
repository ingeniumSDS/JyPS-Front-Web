import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

export default function SolicitarPase() {
  const navigate = useNavigate();
  
  // Usuario simulado (hasta que conectemos el backend)
  const user = { 
    nombre: "Juan Pérez García", 
    email: "juan.perez@utez.edu.mx" 
  };
  
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    horaSalida: '',
    detalles: ''
  });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar antes de enviar
    if (formData.detalles.length < 25) {
      setDetallesError('Debe tener al menos 25 caracteres');
      alert('Los detalles del pase deben tener al menos 25 caracteres');
      return;
    }
    
    if (formData.detalles.length > 255) {
      setDetallesError('No puede exceder 255 caracteres');
      alert('Los detalles del pase no pueden exceder 255 caracteres');
      return;
    }
    
    // Generar código QR simulado
    const codigoQR = Math.random().toString(36).substring(2, 10).toUpperCase();
    
    alert('¡Solicitud enviada correctamente!');
    
    // Por ahora regresamos al dashboard, luego crearemos la pantalla de éxito
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
        <h1 className="text-xl sm:text-2xl font-bold text-[#0F2C59] break-words">Solicitar Pase de Salida</h1>
      </div>

      {/* Form */}
      <Card className="p-4 sm:p-6 md:p-8 border-t-4 border-t-[#0F2C59]">
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

          {/* Fecha y Hora */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              type="date"
              label="Fecha de Salida"
              value={formData.fecha}
              onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
              required
              disabled
              className="bg-gray-50 text-gray-500"
            />
            <Input
              type="time"
              label="Hora de Salida"
              value={formData.horaSalida}
              onChange={(e) => setFormData({ ...formData, horaSalida: e.target.value })}
              required
            />
          </div>

          {/* Detalles */}
          <div>
            <label className="block mb-2 font-medium text-gray-700 text-sm sm:text-base">
              Detalles del Pase <span className="text-red-500">*</span>
            </label>
            <textarea
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border rounded-lg focus:ring-2 outline-none transition-colors resize-none ${
                detallesError 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-100' 
                  : 'border-gray-300 focus:border-[#0F2C59] focus:ring-blue-100'
              }`}
              rows={4}
              placeholder="Describe el motivo de tu salida, destino y cualquier información relevante..."
              value={formData.detalles}
              onChange={handleDetallesChange}
              required
              maxLength={255}
            />
            <div className="flex justify-between items-start mt-1">
              <p className="text-xs text-gray-500">
                Incluye el motivo, destino y hora estimada de regreso
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
            >
              Enviar Solicitud
            </Button>
          </div>
        </form>
      </Card>

      {/* Info */}
      <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-3">
         <p className="text-sm text-blue-800">
          <strong>Nota:</strong> Tu solicitud será enviada para aprobación. Recibirás una notificación una vez que sea aprobada por tu administrador.
        </p>
      </div>
    </div>
  );
}