import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router';
import { Input } from "../components/Input";
import { PasswordInput } from "../components/PasswordInput";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { GraduationCap, Shield, Info, AlertTriangle ,KeyRound, Mail, AlertCircle, FileText, ArrowRight, ShieldCheck, UserX, Clock, Link as LinkIcon } from "lucide-react";
import { Modal } from "../components/Modal";

const MAX_INTENTOS = 3;
const TIEMPO_BLOQUEO_MS = 1 * 60 * 1000;

export default function Login() {
  // Estados de seguridad
    const [intentosFallidos, setIntentosFallidos] = useState(0);
    const [estaBloqueado, setEstaBloqueado] = useState(false);
    const [tiempoRestante, setTiempoRestante] = useState(0);  

    // Cargar estado de bloqueo al iniciar
    useEffect(() => {
    const datosBloqueo = localStorage.getItem('jyps_bloqueo');
    if (datosBloqueo) {
        const { intentos, tiempoDesbloqueo } = JSON.parse(datosBloqueo);
        const ahora = Date.now();

        if (tiempoDesbloqueo && ahora < tiempoDesbloqueo) {
        setEstaBloqueado(true);
        setIntentosFallidos(intentos);
        setTiempoRestante(Math.ceil((tiempoDesbloqueo - ahora) / 1000));
        } else {
        localStorage.removeItem('jyps_bloqueo');
        }
    }
  }, []);

  // contador de tiempo restante
    useEffect(() => {
    let intervalo;
    if (estaBloqueado && tiempoRestante > 0) {
        intervalo = setInterval(() => {
        setTiempoRestante(prev => {
            if (prev <= 1) {
            setEstaBloqueado(false);
            setIntentosFallidos(0);
            localStorage.removeItem('jyps_bloqueo');
            setError(''); // Limpiamos
            return 0;
            }
            return prev - 1;
        });
        }, 1000);
    }
    return () => clearInterval(intervalo);
  }, [estaBloqueado, tiempoRestante]);

  //tiempo en formato mm:ss
  const formatoTiempo = (segundos) => {
    const min = Math.floor(segundos / 60);
    const seg = segundos % 60;
    return `${min}:${seg.toString().padStart(2, '0')}`;
  };

  // Estados básicos para el formulario
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
  //Estados para Modales - cerrados oh abiertos
    const [showSecurityModal, setShowSecurityModal] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);  

    const handleSubmit = (e) => {
        e.preventDefault();
    // Si está bloqueado, no dejamos que intente nada
    if (estaBloqueado) return;

    // Simulación de validación hardcodeada (AQUÍ ES DONDE FALLARÁ A PROPÓSITO)
    if (email === 'trabajador@utez.edu.mx' && password === '123456') {
      // ÉXITO
        setIntentosFallidos(0);
        localStorage.removeItem('jyps_bloqueo');
        setError('');
        navigate('/dashboard'); // Ajusta a la ruta que uses
    } else {
      // FALLO
        const nuevosIntentos = intentosFallidos + 1;
        setIntentosFallidos(nuevosIntentos);

        if (nuevosIntentos >= MAX_INTENTOS) {
        // BLOQUEAR CUENTA
        const tiempoDesbloqueo = Date.now() + TIEMPO_BLOQUEO_MS;
        setEstaBloqueado(true);
        setTiempoRestante(Math.ceil(TIEMPO_BLOQUEO_MS / 1000));
        
        localStorage.setItem('jyps_bloqueo', JSON.stringify({
            intentos: nuevosIntentos,
            tiempoDesbloqueo: tiempoDesbloqueo
        }));
        setError(''); // Limpiamos el error normal para mostrar la pantalla de bloqueo
    } else {
        // SOLO ADVERTIR
        const intentosRestantes = MAX_INTENTOS - nuevosIntentos;
        setError(`Credenciales incorrectas. Te quedan ${intentosRestantes} intento(s).`);
        }
    }
    };

    return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
        
        {/* Encabezado y Logo */}
        <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-[#0F2C59] rounded-full mb-3 sm:mb-4 shadow-lg">
            <GraduationCap size={28} className="text-white sm:w-8 sm:h-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F2C59] mb-2">
            Sistema JyPS
            </h1>
            <p className="text-sm sm:text-base text-gray-600 px-4">
            Sistema de Justificantes y Pases de Salida
            </p>
        </div>

        {/* Tarjeta Principal del Formulario */}
        <Card className="p-6 sm:p-8 border-gray-100">
            {estaBloqueado ? (
                /* --- PANTALLA DE BLOQUEO ESTÁTICA --- */
                <div className="text-center py-2">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                    <AlertTriangle size={40} className="text-[#DC3545]" />
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold text-[#DC3545] mb-4">
                    Cuenta Bloqueada Temporalmente
                    </h2>

                    <p className="text-sm sm:text-base text-gray-700 mb-6">
                    Ha alcanzado el límite de <strong>{MAX_INTENTOS} intentos fallidos</strong> de inicio de sesión.
                    </p>

                    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-6">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="text-center">
                        <p className="text-sm sm:text-base text-gray-700 mb-1">Tu cuenta estará bloqueada por:</p>
                            <div className="flex items-center gap-2 justify-center">
                            <Clock size={24} className="text-red-600" />
                            <p className="text-2xl sm:text-3xl font-bold text-[#DC3545]">
                            {Math.ceil(TIEMPO_BLOQUEO_MS / 60000)} minuto{Math.ceil(TIEMPO_BLOQUEO_MS / 60000) === 1 ? '' : 's'}
                            </p>
                            </div>
                        </div>
                    </div>
                    <p className="text-xs sm:text-sm text-center text-gray-600">
                        Podrás volver a intentar iniciar sesión después de este tiempo.
                    </p>
                    </div>

                    <div className="text-left bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-[#0F2C59] mb-2 text-sm">ℹ️ ¿Qué puedo hacer?</h3>
                    <ul className="text-xs sm:text-sm text-gray-700 space-y-1">
                        <li>• Espere a que pase el tiempo de bloqueo.</li>
                        <li>• Verifique que está usando las credenciales correctas.</li>
                        <li>• Si olvidó su contraseña, use la opción de recuperación.</li>
                        <li>• Contacte al administrador si necesita ayuda.</li>
                    </ul>
                    </div>

                    <Button
                    variant="outline"
                    fullWidth
                    onClick={() => console.log('Ir a recuperar contraseña')}
                    className="mb-3"
                    >
                    ¿Olvidaste tu contraseña?
                    </Button>

                    <p className="text-xs text-gray-500 mt-4">
                    El acceso se restablecerá automáticamente.
                    </p>
                </div>
            ) : (
                /* --- FORMULARIO NORMAL DE LOGIN --- */
                <>
                    <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        type="email"
                        label="Correo Electrónico"
                        placeholder="tu.nombre@utez.edu.mx"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <PasswordInput
                        label="Contraseña"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                  {/* Mensaje de Error (si existe) */}
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                        <AlertTriangle size={16} className="text-red-600 flex-shrink-0" />
                        <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <div className="text-center">
                        <Link to="/recuperar"  className="text-sm text-[#0F2C59] hover:underline font-medium">
                        ¿Olvidaste tu contraseña?
                        </Link>
                    </div>

                    <Button type="submit" disabled={loading} fullWidth>
                        {loading ? "Ingresando..." : "Ingresar"}
                    </Button>
                    </form>

                    <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        ¿No tienes cuenta?{" "}
                        <br></br>
                        Comunícate con el administrador del sistema.
                    </p>
                    </div>
                </>
            )}
        </Card>

        {/* Avisos Legales y Seguridad */}
        <div className="mt-4 space-y-3">
            <Card className="p-3 sm:p-4 bg-amber-50 border border-amber-200">
            <div className="flex items-start gap-2 sm:gap-3">
                <Shield className="text-amber-600 flex-shrink-0 mt-0.5 w-5 h-5" />
                <div>
                <p className="text-xs text-amber-800 mb-2">
                    <strong>Aviso de Seguridad:</strong> Este sistema NO está diseñado para recopilar información personal identificable (PII) sensible ni datos confidenciales. No ingrese información médica detallada, datos financieros o información altamente sensible.
                </p>
                <button
                    type="button"
                    onClick={() => setShowSecurityModal(true)}
                    className="text-xs mb-2 text-amber-700 underline hover:text-amber-900 break-words"
                >
                    Ver más información de seguridad
                </button>
                </div>
            </div>
            </Card>

            <Card className="p-3 sm:p-4 bg-blue-50 border border-blue-200">
            <div className="flex items-start gap-2 sm:gap-3">
                <Info className="text-blue-600 flex-shrink-0 mt-0.5 w-5 h-5" />
                <div>
                <p className="text-xs text-blue-800">
                    Al iniciar sesión, aceptas el uso de cookies estrictamente necesarias para mantener tu sesión activa.
                </p>
                <button
                    type="button"
                    onClick={() => setShowPrivacyModal(true)}
                    className="text-xs text-blue-700 underline hover:text-blue-900 break-words"
                >
                    Ver Aviso de Privacidad completo
                </button>
                </div>
            </div>
            </Card>
        </div>

        {/* Pie de página */}
        <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
            © 2026 UTEZ. Sistema JyPS v1.0.0
            </p>
        </div>
        </div>
        
        {/* ================= MODALES ================= */}
        {/* Modal de Información de Seguridad */}
        <Modal
        isOpen={showSecurityModal}
        onClose={() => setShowSecurityModal(false)}
        title="Información de Seguridad"
        >
        <div className="space-y-4">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <h4 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                ⚠️ Advertencia Importante
            </h4>
            <p className="text-sm text-red-700">
                Este sistema NO está diseñado ni autorizado para almacenar información personal identificable (PII) sensible o datos confidenciales de alto riesgo.
            </p>
            </div>

            <section>
            <h3 className="font-bold text-[#0F2C59] text-sm">❌ NO incluya en sus solicitudes:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1 mt-2 text-sm pl-2">
                <li>Diagnósticos médicos detallados o condiciones de salud sensibles</li>
                <li>Información financiera (números de cuenta, tarjetas, salarios)</li>
                <li>Documentos oficiales con datos personales (INE, CURP completo, RFC)</li>
                <li>Información de terceros sin su consentimiento</li>
                <li>Datos de menores de edad sin autorización parental</li>
            </ul>
            </section>

            <section>
            <h3 className="font-bold text-[#0F2C59] text-sm">✅ Recomendaciones de Uso:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1 mt-2 text-sm pl-2">
                <li>Use descripciones generales para justificantes ("Cita médica", "Trámite personal")</li>
                <li>No comparte su sesión activa con otras personas</li>
                <li>Cierre sesión al terminar de usar el sistema en dispositivos compartidos</li>
                <li>Reporte cualquier irregularidad al administrador del sistema</li>
            </ul>
            </section>

            <section>
            <h3 className="font-bold text-[#0F2C59] text-sm">🔒 Medidas de Seguridad Actuales:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1 mt-2 text-sm pl-2">
                <li>Almacenamiento local cifrado en el navegador</li>
                <li>Validación de cuentas activas/inactivas</li>
                <li>Control de acceso basado en roles</li>
                <li>Protección de rutas por autenticación</li>
            </ul>
            </section>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <p className="text-sm text-blue-800">
                <strong>Nota:</strong> Este es un sistema de demostración educativo. Para un entorno de producción, se requieren medidas de seguridad adicionales como encriptación end-to-end, auditorías de seguridad y cumplimiento de estándares como ISO 27001.
            </p>
            </div>
        </div>
        </Modal>

      {/* Modal de Aviso de Privacidad */}
        <Modal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        title="Aviso de Privacidad"
        size="lg"
        >
        <div className="space-y-4">
            <section>
            <h3 className="font-bold text-[#0F2C59] text-sm">1. Responsable del Tratamiento de Datos</h3>
            <p className="text-gray-700 text-sm mt-1">
                La Universidad Tecnológica Emiliano Zapata del Estado de Morelos (UTEZ), con domicilio en Av. Universidad Tecnológica No. 1, Col. Palo Escrito, Emiliano Zapata, Morelos, es responsable del tratamiento de sus datos personales.
            </p>
            </section>

            <section>
            <h3 className="font-bold text-[#0F2C59] text-sm">2. Datos Recopilados</h3>
            <p className="text-gray-700 text-sm mt-1">El sistema recopila únicamente:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 mt-1 text-sm pl-2">
                <li>Nombre completo</li>
                <li>Correo electrónico institucional</li>
                <li>Número de teléfono</li>
                <li>Rol en la institución</li>
                <li>Información sobre solicitudes de pases y justificantes</li>
            </ul>
            </section>

            <section>
            <h3 className="font-bold text-[#0F2C59] text-sm">3. Finalidad del Tratamiento</h3>
            <p className="text-gray-700 text-sm mt-1">Sus datos serán utilizados exclusivamente para:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 mt-1 text-sm pl-2">
                <li>Gestionar solicitudes de pases de salida</li>
                <li>Gestionar justificantes de ausencia</li>
                <li>Control de acceso y seguridad institucional</li>
                <li>Reportes estadísticos internos</li>
            </ul>
            </section>

            <section>
            <h3 className="font-bold text-[#0F2C59] text-sm">4. Almacenamiento y Seguridad</h3>
            <p className="text-gray-700 text-sm mt-1">
                Los datos se almacenan localmente en su navegador mediante tecnología localStorage. Es su responsabilidad no compartir dispositivos con acceso a su sesión activa.
            </p>
            </section>

            <section>
            <h3 className="font-bold text-[#0F2C59] text-sm">5. Derechos ARCO</h3>
            <p className="text-gray-700 text-sm mt-1">
                Usted tiene derecho a Acceder, Rectificar, Cancelar u Oponerse al tratamiento de sus datos personales, conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP).
            </p>
            </section>

            <section>
            <h3 className="font-bold text-[#0F2C59] text-sm">6. Contacto</h3>
            <p className="text-gray-700 text-sm mt-1">
                Para ejercer sus derechos ARCO o cualquier duda sobre el tratamiento de sus datos, contacte al administrador del sistema o al departamento de TI de la institución.
            </p>
            </section>

            <div className="pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 italic text-left">
                Última actualización: 11 de febrero de 2026
            </p>
            </div>
        </div>
        </Modal>
    </div>
    );
}