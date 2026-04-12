import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { User, Mail, Phone, Lock } from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import ChangePasswordModal from '../../components/modals/ChangePasswordModal'; 

export function Perfil() {
    
    // CONTEXTO 
    const { user, isLoadingSession } = useAuth(); 
    
    // ESTADOS 
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

    // HANDLERS 
    const handleOpenChangePasswordModal = () => setIsChangePasswordModalOpen(true);
    const handleCloseChangePasswordModal = () => setIsChangePasswordModalOpen(false);

    // --- EXTRACCIÓN DE DATOS ACTUALIZADA ---
    // 1. El correo ahora viene en 'sub' según el token JWT
    const correoUsuario = user?.sub || 'No registrado';
    
    // 2. El rol es un arreglo. Tomamos el primero y limpiamos los guiones bajos (ej. JEFE_DE_DEPARTAMENTO)
    const rolUsuario = user?.roles?.[0]?.replace(/_/g, ' ') || 'Sin Rol';
    
    // 3. (Opcional) Podemos juntar nombre y apellido si tu token los trae separados
    const nombreCompleto = user?.nombre 
        ? `${user.nombre} ${user?.apellidoPaterno || ''}`.trim() 
        : 'Usuario';

    // RENDER: CARGA 
    if (isLoadingSession) {
        return (
            <div className="flex items-center justify-center h-full p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F2C59]"></div>
                <span className="ml-3 text-gray-500">Cargando perfil...</span>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            
            {/* HEADER */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#0F2C59]">Perfil del Usuario</h1>
                <p className="text-gray-500 text-sm mt-1">
                    Gestiona tu información personal y credenciales
                </p>
            </div>

            {/* CONTENIDO PRINCIPAL */}
            <Card className="p-6 md:p-8 bg-white shadow-sm rounded-xl border border-gray-100">
                
                {/* SECCIÓN: AVATAR */}
                <div className="text-center mb-8 flex flex-col items-center justify-center">
                    <div className="w-24 h-24 bg-[#0F2C59] rounded-full flex items-center justify-center mb-4">
                        <span className="text-3xl font-bold text-white">
                            {nombreCompleto.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <h2 className="text-xl font-bold text-[#0F2C59]">
                        {nombreCompleto}
                    </h2>
                    {/* Aplicamos capitalize para que no salga todo en mayúsculas gritando */}
                    <p className="text-sm text-gray-500 mt-1 capitalize">
                        {rolUsuario.toLowerCase()}
                    </p>
                </div>

                {/* SECCIÓN: DATOS */}
                <div className="space-y-4 mb-8">
                    
                    {/* DATO: CORREO */}
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                            <Mail size={20} className="text-gray-500" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Correo Institucional</p>
                            <p className="font-medium text-[#0F2C59] mt-0.5">
                                {correoUsuario}
                            </p>
                        </div>
                    </div>

                    {/* DATO: TELÉFONO */}
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                            <Phone size={20} className="text-gray-500" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Teléfono</p>
                            <p className="font-medium text-[#0F2C59] mt-0.5">
                                {user?.telefono || 'No registrado'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* SECCIÓN: ACCIONES */}
                <div>
                    <Button 
                        variant="outline" 
                        fullWidth
                        onClick={handleOpenChangePasswordModal}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center py-2.5"
                    >
                        <Lock size={18} className="mr-2" />
                        Cambiar Contraseña
                    </Button>
                </div>
            </Card>

            {/* MODALES */}
            {isChangePasswordModalOpen && (
                <ChangePasswordModal
                    isOpen={isChangePasswordModalOpen}
                    onClose={handleCloseChangePasswordModal}
                />
            )}
        </div>
    );
}

export default Perfil;