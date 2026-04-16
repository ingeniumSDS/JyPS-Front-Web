import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useUsuarios } from '../hooks/useUsuarios';
import { ModalInfoSeguridad } from '../components/modals/ModalInfoSeguridad';
import { ModalAvisoPrivacidad } from '../components/modals/ModalAvisoPrivacidad';
import { Input } from "../components/Input";
import { PasswordInput } from "../components/PasswordInput";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { GraduationCap, Shield, Info, AlertTriangle, Clock } from "lucide-react";

// --- CONSTANTES ---
const MAX_INTENTOS = 3;
const TIEMPO_BLOQUEO_MS = 1 * 60 * 1000;

// --- UTILS ---
const decodificarJwt = (token) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
};

const obtenerRutaPorRol = (datosDelToken) => {
    const rolCrudo = datosDelToken?.rol || datosDelToken?.roles || '';
    const rolUsuario = typeof rolCrudo === 'string' ? rolCrudo.toUpperCase() : (rolCrudo[0] || '').toUpperCase(); 

    switch(rolUsuario) {
        case 'ADMINISTRADOR': return '/administrador';
        case 'GUARDIA':       return '/guardia';
        case 'JEFE_DE_DEPARTAMENTO':          return '/jefe-area';
        case 'AUDITOR':            return '/recursos-humanos';
        case 'TRABAJADOR':    return '/trabajador';
        default:              return '/trabajador'; 
    }
};

export default function Login() {
    const navigate = useNavigate();
    const { iniciarSesion, user, isLoading: isAuthLoading } = useAuth();
    const { loginUsuario, isLoading: isApiLoading } = useUsuarios();
    
    // ESTADOS: SEGURIDAD 
    const [intentosFallidos, setIntentosFallidos] = useState(0);
    const [estaBloqueado, setEstaBloqueado] = useState(false);
    const [tiempoRestante, setTiempoRestante] = useState(0);  

    // ESTADOS: FORMULARIO 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // ESTADOS: MODALES 
    const [showSecurityModal, setShowSecurityModal] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);  

    // EFECTOS 
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

    useEffect(() => {
        let intervalo;
        if (estaBloqueado && tiempoRestante > 0) {
            intervalo = setInterval(() => {
                setTiempoRestante(prev => {
                    if (prev <= 1) {
                        setEstaBloqueado(false);
                        setIntentosFallidos(0);
                        localStorage.removeItem('jyps_bloqueo');
                        setError(''); 
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(intervalo);
    }, [estaBloqueado, tiempoRestante]);

    useEffect(() => {
        if (isAuthLoading || !user) return;

        const rutaDestino = obtenerRutaPorRol(user);
        navigate(rutaDestino, { replace: true });
    }, [isAuthLoading, user, navigate]);

    // HANDLERS 
    const handleSubmit = async (e) => { 
        e.preventDefault();
        
        if (estaBloqueado) return;
        
        const response = await loginUsuario(email, password);
        
        if (response.exito) {
            setIntentosFallidos(0);
            localStorage.removeItem('jyps_bloqueo');
            setError('');

            const token = response.data.tokenJwt; 
            const datosDelToken = decodificarJwt(token);
            
            await iniciarSesion(token);

            const rutaDestino = obtenerRutaPorRol(datosDelToken);
            navigate(rutaDestino);
        } else {
            const nuevosIntentos = intentosFallidos + 1;
            setIntentosFallidos(nuevosIntentos);

            if (nuevosIntentos >= MAX_INTENTOS) {
                const tiempoDesbloqueo = Date.now() + TIEMPO_BLOQUEO_MS;
                setEstaBloqueado(true);
                setTiempoRestante(Math.ceil(TIEMPO_BLOQUEO_MS / 1000));
                
                localStorage.setItem('jyps_bloqueo', JSON.stringify({
                    intentos: nuevosIntentos,
                    tiempoDesbloqueo: tiempoDesbloqueo
                }));
                setError(''); 
            } else {
                const intentosRestantes = MAX_INTENTOS - nuevosIntentos;
                setError(` Erros de credenciales. Te quedan ${intentosRestantes} intento(s).`);
            }
        }
    };

    // RENDER 
    return (
        <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-md">
                
                {/* HEADER */}
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

                <Card className="p-6 sm:p-8 border-gray-100">
                    {estaBloqueado ? (
                        /* ESTADO: BLOQUEADO */
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
                                        <p className="text-sm sm:text-base text-gray-700 mb-1">
                                            Tu cuenta estará bloqueada por:
                                        </p>
                                        <div className="flex items-center gap-2 justify-center">
                                            <Clock size={24} className="text-red-600" />
                                            <p className="text-2xl sm:text-3xl font-bold text-[#DC3545]">
                                                {Math.ceil(tiempoRestante / 60)} minuto{Math.ceil(tiempoRestante / 60) === 1 ? '' : 's'}
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
                                onClick={() => navigate('/recuperar')}
                                className="mb-3"
                            >
                                ¿Olvidaste tu contraseña?
                            </Button>

                            <p className="text-xs text-gray-500 mt-4">
                                El acceso se restablecerá automáticamente.
                            </p>
                        </div>
                    ) : (
                        /* ESTADO: FORMULARIO NORMAL */
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

                                {error && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                                        <AlertTriangle size={16} className="text-red-600 flex-shrink-0" />
                                        <p className="text-sm text-red-700">{error}</p>
                                    </div>
                                )}

                                <div className="text-center">
                                    <Link to="/recuperar" className="text-sm text-[#0F2C59] hover:underline font-medium">
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                </div>

                                <Button type="submit" disabled={isApiLoading} fullWidth>
                                    {isApiLoading ? "Ingresando..." : "Ingresar"}
                                </Button>
                            </form>

                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-600">
                                    ¿No tienes cuenta? <br />
                                    Comunícate con el administrador del sistema.
                                </p>
                            </div>
                        </>
                    )}
                </Card>

                {/* AVISOS LEGALES */}
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

                {/* FOOTER */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-400">
                        © 2026 UTEZ. Sistema JyPS v1.0.0
                    </p>
                </div>
            </div>
            
            {/* RENDER MODALES */}
            <ModalInfoSeguridad 
                isOpen={showSecurityModal} 
                onClose={() => setShowSecurityModal(false)} 
            />

            <ModalAvisoPrivacidad 
                isOpen={showPrivacyModal} 
                onClose={() => setShowPrivacyModal(false)}
            />
        </div>
    );
}