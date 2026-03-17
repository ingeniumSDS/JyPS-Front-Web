import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../components/Card'; 
import { Button } from '../components/Button'; 
import { Input } from '../components/Input'; 
import { GraduationCap, ArrowLeft, AlertTriangle } from 'lucide-react';

export default function Recuperar() {
  const navigate = useNavigate();
  
  // Maneja en qué vista estamos ('email', 'code', 'success')
  const [step, setStep] = useState('email');
  
  // Estados para los datos y errores
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Código simulado para desarrollo
  const [generatedCode, setGeneratedCode] = useState('');

  // ----------------------------------------------------
  // MANEJADOR: Enviar Correo
  // ----------------------------------------------------
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulamos un retraso de red
    setTimeout(() => {
      // Validación básica
      if (!email.trim() || !email.includes('@')) {
        setError('Por favor ingresa un correo electrónico válido.');
        setLoading(false);
        return;
      }
      
      if (!email.endsWith('@utez.edu.mx')) {
        setError('El correo debe pertenecer al dominio @utez.edu.mx');
        setLoading(false);
        return;
      }

      // SIMULACIÓN: Generamos un código y pasamos al siguiente paso.
      const fakeCode = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(fakeCode);
      console.log('Código para pruebas:', fakeCode);
      
      setStep('code');
      setLoading(false);
    }, 1000);
  };

  // ----------------------------------------------------
  // MANEJADOR:Ingresar Código
  // ----------------------------------------------------
  // inputs
  const handleCodeChange = (index, value) => {
    // Solo permitir números
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Mover el foco al siguiente input automáticamente
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
      }
    }
  };
  // delets (Detectar si se presiono la tecla de borrado )
  const handleKeyDown = (index, e) => {
  if (e.key === 'Backspace') {
    if (!code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  }
};

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const codigoCompleto = code.join('');

      if (codigoCompleto.length !== 6) {
        setError('Por favor, ingresa los 6 dígitos del código.');
        setLoading(false);
        return;
      }

      // Verificamos con nuestro código simulado
      if (codigoCompleto !== generatedCode) {
        setError('Código no válido. Verifique el código enviado a su correo');
        setLoading(false);
        return;
      }

      setStep('success');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-[#0F2C59] rounded-full mb-3 sm:mb-4 shadow-lg">
            <GraduationCap size={28} className="text-white sm:w-8 sm:h-8" />
          </div>
          <h1 className="text-3xl font-bold text-[#0F2C59] mb-2">
            {step === 'success' ? '¡Listo!' : 'Recuperar Contraseña'}
          </h1>
          <p className="text-gray-600 px-4">
            {step === 'email' && 'Ingresa tu correo electrónico'}
            {step === 'code' && 'Ingresa el código enviado a tu correo'}
            {step === 'success' && 'Contraseña restablecida exitosamente'}
          </p>
        </div>

        <Card className="p-8 border-gray-100 shadow-xl">
          
          {/* VISTA: INGRESAR CORREO */}
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

              <Button type="submit" disabled={loading} fullWidth>
                {loading ? 'Enviando...' : 'Enviar Código'}
              </Button>
            </form>
          )}

          {/* VISTA: INGRESAR CÓDIGO */}
          {step === 'code' && (
            <form onSubmit={handleCodeSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#0F2C59] mb-3 text-center">
                  Código de Verificación
                </label>
                <div className="flex justify-center gap-2 sm:gap-3">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      id={`code-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-lg focus:border-[#0F2C59] focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-center text-gray-600">
                Enviamos el código a: <br/>
                <strong className="text-[#0F2C59]">{email}</strong>
              </p>

              {/* Caja de ayuda SOLO DESARROLLO */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
                  <p className="text-xs text-blue-800">
                      MODO DEV | Código generado: <strong className="text-sm">{generatedCode}</strong>
                  </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                  <AlertTriangle size={16} className="text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <Button type="submit" disabled={loading} fullWidth>
                {loading ? 'Verificando...' : 'Verificar Código'}
              </Button>
              
              <div className="text-center">
                <button
                    type="button"
                    onClick={() => {
                        setStep('email');
                        setCode(['', '', '', '', '', '']);
                        setError('');
                    }}
                    className="text-sm text-gray-500 hover:text-[#0F2C59] hover:underline"
                >
                    Reenviar código
                </button>
              </div>
            </form>
          )}

          {/* VISTA: ÉXITO / REENVIAR A LOGIN */}
          {step === 'success' && (
              <div className="text-center space-y-6 py-4">
                <div className="w-16 h-16 bg-[#28A745] rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <p className=" text-gray-600 px-2">
                    Se ha enviado un enlace para restablecer tu contraseña a tu correo electrónico.
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

          {/* Botón de Regresar Solo si no está en exito */}
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