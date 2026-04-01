import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card } from '../components/Card'; 
import { Button } from '../components/Button'; 
import { Input } from '../components/Input'; 
import { Lock, AlertTriangle, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { useUsuarios } from '../hooks/useUsuarios';

export default function NuevaPassword() {
    const { token } = useParams(); // Atrapa el token 
    const navigate = useNavigate();
    const { verificarToken, restablecerContrasena, isLoading } = useUsuarios();

    // Estados de pantalla
    const [estadoVista, setEstadoVista] = useState('verificando'); 
    const [mensajeError, setMensajeError] = useState('');

    // Datos del formulario
    const [passwords, setPasswords] = useState({
        nueva: '',
        confirmacion: ''
    });

    // Verificamos el token 
    useEffect(() => {
    const validarEnlace = async () => {
        if (!token) {
            setEstadoVista('error_token');
            setMensajeError('El enlace de recuperación no es válido o está incompleto.');
            return;
        }

        const respuesta = await verificarToken(token);

        if (respuesta.exito) {
            setEstadoVista('formulario');
        } else {
            setEstadoVista('error_token');
            setMensajeError('El enlace ha expirado o no es válido.');
        }
    };

        validarEnlace();
    }, [token]);

    // Manejador para guardar la nueva contraseña
    const handleSubmit = async (e) => {
        e.preventDefault();
    setMensajeError('');
    //Campos vacios
    if (!passwords.nueva || !passwords.confirmacion) {
        setMensajeError('Por favor llena ambos campos.');
        return;
    }
    //coincidan
    if (passwords.nueva !== passwords.confirmacion) {
        setMensajeError('Las contraseñas no coinciden.');
        return;
    }
    //Longitud-mayuscula-minuscula-numero
    if (passwords.nueva.length < 12) {
        setMensajeError('La contraseña debe tener al menos 12 caracteres.');
        return;
    }
    if (!/[A-Z]/.test(passwords.nueva)) {
        setMensajeError('La contraseña debe contener al menos una letra mayúscula.');
        return;
    }
    if (!/[a-z]/.test(passwords.nueva)) {
        setMensajeError('La contraseña debe contener al menos una letra minúscula.');
        return;
    }
    if (!/\d/.test(passwords.nueva)) {
        setMensajeError('La contraseña debe contener al menos un número.');
        return;
    }
    // Carter especial
    if (!/[^A-Za-z0-9]/.test(passwords.nueva)) {
        setMensajeError('La contraseña debe contener al menos un carácter especial (ej. !@#$%&*).');
        return;
    }
    // Llamada al backend si todo está correcto
    const respuesta = await restablecerContrasena(token, passwords.nueva);
    // Contraseña no es aceptada 
    if (respuesta.exito) {
        setEstadoVista('exito');
    } else {
        setMensajeError('Contraseña invalida intenatlo con otro.');
    }
    };

    return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
        
        <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-[#0F2C59] rounded-full mb-3 sm:mb-4 shadow-lg">
            <Lock size={28} className="text-white sm:w-8 sm:h-8" />
            </div>
            <h1 className="text-3xl font-bold text-[#0F2C59] mb-2">
            Nueva Contraseña
            </h1>
            <p className="text-gray-600 px-4">
            {estadoVista === 'verificando' && 'Validando tu enlace seguro...'}
            {estadoVista === 'formulario' && 'Crea una contraseña segura y fácil de recordar'}
            {estadoVista === 'error_token' && 'Enlace no válido'}
            {estadoVista === 'exito' && '¡Actualización completada!'}
            </p>
        </div>

        <Card className="p-8 border-gray-100 shadow-xl">

            {/* VISTA 1: VERIFICANDO TOKEN */}
            {estadoVista === 'verificando' && (
            <div className="text-center py-8">
                <Loader2 size={40} className="animate-spin text-[#0F2C59] mx-auto mb-4" />
                <p className="text-gray-500">Estamos verificando tu solicitud...</p>
            </div>
            )}

            {/* VISTA 2: ERROR DE TOKEN  */}
            {estadoVista === 'error_token' && (
            <div className="text-center space-y-6 py-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex flex-col items-center gap-3">
                <AlertTriangle size={32} className="text-red-600" />
                <p className="text-red-700 font-medium">{mensajeError}</p>
                </div>
                <Link to="/recuperar">
                <Button fullWidth variant="outline" className="border-[#0F2C59] text-[#0F2C59]">
                    Solicitar un nuevo enlace
                </Button>
                </Link>
            </div>
            )}

            {/* VISTA 3: FORMULARIO */}
            {estadoVista === 'formulario' && (
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                <Input
                    type="password"
                    label="Nueva Contraseña"
                    placeholder="********"
                    value={passwords.nueva}
                    onChange={(e) => setPasswords({...passwords, nueva: e.target.value})}
                />
                    <p className="text-xs text-gray-500 mt-2 px-1">
                        Mínimo 12 caracteres. Debe incluir mayúscula, minúscula, número y un carácter especial.
                    </p>
                </div>
                <Input
                    type="password"
                    label="Confirmar Contraseña"
                    placeholder="********"
                    value={passwords.confirmacion}
                    onChange={(e) => setPasswords({...passwords, confirmacion: e.target.value})}
                />

                {mensajeError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                    <AlertTriangle size={16} className="text-red-600 flex-shrink-0" />
                    <p className="text-sm text-red-700">{mensajeError}</p>
                </div>
                )}

                <Button type="submit" disabled={isLoading} fullWidth>
                {isLoading ? 'Guardando...' : 'Restablecer Contraseña'}
                </Button>
            </form>
            )}

          {/* VISTA 4: ÉXITO */}
            {estadoVista === 'exito' && (
            <div className="text-center space-y-6 py-4">
                <div className="w-16 h-16 bg-[#28A745] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={32} className="text-white" />
                </div>
                <p className="text-gray-600 px-2">
                Tu contraseña ha sido actualizada correctamente. Ya puedes acceder a tu cuenta.
                </p>
                <div className="pt-4">
                <Link to="/login">
                    <Button fullWidth>
                    Ir a Iniciar Sesión
                    </Button>
                </Link>
                </div>
            </div>
            )}

          {/* Botón de Regresar General */}
            {(estadoVista === 'formulario' || estadoVista === 'error_token') && (
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