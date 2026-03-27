import { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle, Info, AlertCircle } from 'lucide-react';
import { Modal } from '../Modal'; 
import { Input } from '../Input';
import { Button } from '../Button';

export function ChangePasswordModal({ isOpen, onClose }) {
    const [isLoading, setIsLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [passwordStrength, setPasswordStrength] = useState({
        hasMinLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecialChar: false
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'newPassword') {
        setPasswordStrength({
            hasMinLength: value.length >= 8,
            hasUpperCase: /[A-Z]/.test(value),
            hasLowerCase: /[a-z]/.test(value),
            hasNumber: /[0-9]/.test(value),
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value)
        });
    }
    };

    const isPasswordStrong = () => {
        return Object.values(passwordStrength).every(requirement => requirement);
    };

    const PasswordRequirement = ({ met, text }) => (
    <div className={`flex items-center gap-2 text-sm ${met ? 'text-green-600' : 'text-gray-500'}`}>
        {met ? (
        <CheckCircle size={16} className="flex-shrink-0" />
        ) : (
        <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
        )}
        <span>{text}</span>
    </div>
    );

    const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
        if (!formData.currentPassword.trim()) throw new Error('Debes ingresar tu contraseña actual');
        if (!formData.newPassword.trim()) throw new Error('Debes ingresar una nueva contraseña');
        if (!formData.confirmPassword.trim()) throw new Error('Debes confirmar tu nueva contraseña');
        if (formData.newPassword !== formData.confirmPassword) throw new Error('Las contraseñas no coinciden');
        if (!isPasswordStrong()) throw new Error('La contraseña no cumple con la seguridad mínima');

        // SIMULACION DE API
        console.log("Enviando datos a la API...", {
        passwordActual: formData.currentPassword,
        nuevaPassword: formData.newPassword
        });
        // Simulamos tiempo
        await new Promise(resolve => setTimeout(resolve, 1500)); 

        alert('¡Contraseña actualizada correctamente!'); 
        handleClose();

        } catch (err) {
        alert(err.message || 'Error al actualizar la contraseña');
        } finally {
        setIsLoading(false);
        }
    };

    const handleClose = () => {
    setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setPasswordStrength({
        hasMinLength: false, hasUpperCase: false, hasLowerCase: false, hasNumber: false, hasSpecialChar: false
    });
    onClose();
  };

    return (
    <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Cambiar Contraseña"
    >
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
        
        {/* Contraseña Actual */}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña Actual *
            </label>
            <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="text-gray-400" size={18} />
            </div>
            <Input
                type={showCurrentPassword ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                placeholder="Ingresa tu contraseña actual"
                disabled={isLoading}
                className="pl-10 pr-10 w-full"
            />
            <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            </div>
        </div>

        {/* Nueva Contraseña */}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
            Nueva Contraseña *
            </label>
            <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="text-gray-400" size={18} />
            </div>
            <Input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="Crea una contraseña segura"
                disabled={isLoading}
                className="pl-10 pr-10 w-full"
            />
            <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            </div>
        </div>

        {/* Requisitos de contraseña */}
        {formData.newPassword && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
                <Info className="text-[#0F2C59]" size={16} />
                <h4 className="text-sm font-medium text-gray-900">Requisitos de Seguridad</h4>
            </div>
            <div className="space-y-1.5">
                <PasswordRequirement met={passwordStrength.hasMinLength} text="Mínimo 8 caracteres" />
                <PasswordRequirement met={passwordStrength.hasUpperCase} text="Al menos una mayúscula (A-Z)" />
                <PasswordRequirement met={passwordStrength.hasLowerCase} text="Al menos una minúscula (a-z)" />
                <PasswordRequirement met={passwordStrength.hasNumber} text="Al menos un número (0-9)" />
                <PasswordRequirement met={passwordStrength.hasSpecialChar} text="Al menos un carácter especial" />
            </div>
            </div>
        )}

        {/* Confirmar Contraseña */}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirmar Nueva Contraseña *
            </label>
            <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="text-gray-400" size={18} />
            </div>
            <Input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Repite tu nueva contraseña"
                disabled={isLoading}
                className="pl-10 pr-10 w-full"
            />
            <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            </div>
            {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
            <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
                <AlertCircle size={12} />
                <span>Las contraseñas no coinciden</span>
            </div>
            )}
            {formData.confirmPassword && formData.newPassword === formData.confirmPassword && (
            <div className="flex items-center gap-1 mt-1 text-green-600 text-xs">
                <CheckCircle size={12} />
                <span>Las contraseñas coinciden</span>
            </div>
            )}
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-4 border-t border-gray-100 mt-6">
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
            disabled={isLoading || !isPasswordStrong() || formData.newPassword !== formData.confirmPassword}
            className="flex-1 bg-[#86D293] hover:bg-[#68bc76] text-white border-none"
            >
            {isLoading ? 'Guardando...' : 'Cambiar Contraseña'}
            </Button>
        </div>
        </form>
    </Modal>
 );
}