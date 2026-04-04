import { useState } from 'react';
import { GraduationCap, AlertTriangle, CheckCircle } from 'lucide-react';
import { Modal } from '../Modal'; 
import { Input } from '../Input';
import { Button } from '../Button';
import { useUsuarios } from '../../hooks/useUsuarios';

export default function RecuperarPasswordModal({ isOpen, onClose }) {
    // Estados: Formulario/ Exito
    const [step, setStep] = useState('email');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    
    // Hook 
    const { solicitarRecuperacion, isLoading } = useUsuarios();

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validacion 
        if (!email.trim() || !email.includes('@')) {
            setError('Por favor ingresa un correo electrónico válido.');
            return;
        }
        
        // dominio UTEZ
        if (!email.endsWith('@utez.edu.mx')) {
            setError('El correo debe pertenecer al dominio @utez.edu.mx');
            return;
        }
        // Llamada al backend
        const respuesta = await solicitarRecuperacion(email);

        if (respuesta.exito) {
            // vista exito
            setStep('success');
        } else {
            setError('Hubo un error al procesar tu solicitud. Verifica tu correo.');
        }
    };

    // Limpiesa al cerrar
    const handleClose = () => {
        setStep('email');
        setEmail('');
        setError('');
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={step === 'email' ? "Recuperar Contraseña" : ""}
        >
            <div className="pt-2">
                {/* VISTA 1: INGRESAR CORREO */}
                {step === 'email' && (
                    <form onSubmit={handleEmailSubmit} className="space-y-6">
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-[#0F2C59] rounded-full mb-3 shadow-md">
                                <GraduationCap size={24} className="text-white" />
                            </div>
                            <p className="text-gray-600 px-4 text-sm">
                                Ingresa tu correo electrónico institucional.
                            </p>
                        </div>

                        <Input
                            type="email"
                            label="Correo Electrónico"
                            placeholder="tu.nombre@utez.edu.mx"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                        />

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                                <AlertTriangle size={16} className="text-red-600 flex-shrink-0" />
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        <div className="flex gap-3 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                fullWidth
                                onClick={handleClose}
                                disabled={isLoading}
                                className="flex-1 border-gray-300 text-gray-700"
                            >
                                Cancelar
                            </Button>
                            <Button 
                                type="submit" 
                                fullWidth
                                disabled={isLoading} 
                                className="flex-1 bg-[#0F2C59] hover:bg-[#0a1e3f] text-white"
                            >
                                {isLoading ? 'Enviando...' : 'Enviar enlace'}
                            </Button>
                        </div>
                    </form>
                )}

                {/* VISTA 2: ÉXITO */}
                {step === 'success' && (
                    <div className="text-center space-y-6 py-4 px-2">
                        <div className="w-16 h-16 bg-[#28A745] rounded-full flex items-center justify-center mx-auto shadow-md">
                            <CheckCircle size={36} className="text-white" />
                        </div>
                        
                        <div>
                            <h3 className="text-xl font-bold text-[#0F2C59] mb-3">
                                ¡Correo Enviado!
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Si el correo <strong>{email}</strong> está registrado, recibirás un enlace para restablecer tu contraseña en los próximos minutos.
                            </p>
                        </div>

                        <div className="pt-4">
                            <Button 
                                fullWidth 
                                onClick={handleClose}
                                className="bg-[#0F2C59] hover:bg-[#0a1e3f] text-white"
                            >
                                Entendido
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
}