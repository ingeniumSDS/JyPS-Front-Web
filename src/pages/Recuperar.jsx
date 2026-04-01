import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/Card'; 
import { Button } from '../components/Button'; 
import { Input } from '../components/Input'; 
import { GraduationCap, ArrowLeft, AlertTriangle } from 'lucide-react';
import { useUsuarios } from '../hooks/useUsuarios'; 

export default function Recuperar() {
  //'email' y 'success'
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  
  // llamada a la función y el estado de carga 
  const { solicitarRecuperacion, isLoading } = useUsuarios();

  // MANEJADOR
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validacion basica
    if (!email.trim() || !email.includes('@')) {
      setError('Por favor ingresa un correo electrónico válido.');
      return;
    }
    
    // dominio UTEZ
    if (!email.endsWith('@utez.edu.mx')) {
      setError('El correo debe pertenecer al dominio @utez.edu.mx');
      return;
    }

    // Llamada 
    const respuesta = await solicitarRecuperacion(email);

    if (respuesta.exito) {
      // exito
      setStep('success');
    } else {
      // falla 
      setError('Hubo un error al procesar tu solicitud.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-[#0F2C59] rounded-full mb-3 sm:mb-4 shadow-lg">
            <GraduationCap size={28} className="text-white sm:w-8 sm:h-8" />
          </div>
          <h1 className="text-3xl font-bold text-[#0F2C59] mb-2">
            {step === 'success' ? '¡Correo Enviado!' : 'Recuperar Contraseña'}
          </h1>
          <p className="text-gray-600 px-4">
            {step === 'email' && 'Ingresa tu correo electrónico institucional'}
            {step === 'success' && 'Revisa tu bandeja de entrada'}
          </p>
        </div>

        <Card className="p-8 border-gray-100 shadow-xl">
          
          {/* VISTA 1: INGRESAR CORREO */}
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <Input
                type="email"
                label="Correo Electrónico"
                placeholder="tu.nombre@utez.edu.mx"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                  <AlertTriangle size={16} className="text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <Button type="submit" disabled={isLoading} fullWidth>
                {isLoading ? 'Enviando...' : 'Enviar enlace de recuperación'}
              </Button>
            </form>
          )}

          {/* VISTA 2: EXITO */}
          {step === 'success' && (
              <div className="text-center space-y-6 py-4">
                <div className="w-16 h-16 bg-[#28A745] rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <p className="text-gray-600 px-2">
                    Si el correo <strong>{email}</strong> está registrado, recibirás un enlace para restablecer tu contraseña en los próximos minutos.
                </p>

                <div className="pt-4">
                    <Link to="/login">
                        <Button fullWidth variant="outline" className="border-[#0F2C59] text-[#0F2C59] hover:bg-slate-50">
                            Volver al Inicio de Sesión
                        </Button>
                    </Link>
                </div>
              </div>
          )}

          {/* BotOn de Regresar */}
          {step !== 'success' && (
            <div className="mt-8 text-center">
              <Link 
                to="/login" 
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#0F2C59] transition-colors"
              >
                <ArrowLeft size={16} />
                Volver al inicio de sesión
              </Link>
            </div>
          )}

        </Card>
      </div>
    </div>
  );
}