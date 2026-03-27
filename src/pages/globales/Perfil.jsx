import { useState, useEffect } from 'react';
import { User, Mail, Phone, Lock } from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { ChangePasswordModal } from '../../components/modals/ChangePasswordModal'; 

export function Perfil() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);


    // SIMULACIÓN DE LLAMADA API
    useEffect(() => {
    const fetchUserData = async () => {
        try {
        // Simulamos el tiempo de respuesta 
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Datos Hardcodeados 
        const mockUserData = {
            nombre: "Administrador Demo",
            rol: "Administrador de Sistema",
            email: "admin.demo@utez.edu.mx",
            telefono: "777-123-4567"
        };
        
        setUser(mockUserData);
      } catch (error) {
        console.error("Error al cargar datos del usuario", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);
  

    const handleOpenChangePasswordModal = () => setIsChangePasswordModalOpen(true);
    const handleCloseChangePasswordModal = () => setIsChangePasswordModalOpen(false);

  // Pantalla de carga 
    if (isLoading) {
    return (
        <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 font-medium">Cargando perfil...</p>
        </div>
    );
    }

    return (
    <div className="pb-8 max-w-3xl mx-auto w-full">
      {/* Header */}
        <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#0F2C59]">Mi Perfil</h1>
            <p className="text-gray-600 mt-1">Información personal</p>
        </div>

      {/* Content */}
        <Card className="p-6 md:p-8 bg-white shadow-sm rounded-xl border border-gray-100">
        
        {/* Avatar */}
        <div className="text-center mb-8 flex flex-col items-center justify-center">
            <div className="w-24 h-24 bg-[#0F2C59] rounded-full flex items-center justify-center mb-4">
                <User size={48} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-[#0F2C59]">
            {user?.nombre}
            </h2>
            <p className="text-sm text-gray-500 mt-1 capitalize">
            {user?.rol}
            </p>
        </div>

        {/* Info Blocks */}
        <div className="space-y-4 mb-8">
          {/* Correo */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                <Mail size={20} className="text-gray-500" />
            </div>
            <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Correo Institucional</p>
                <p className="font-medium text-[#0F2C59] mt-0.5">
                {user?.email}
                </p>
            </div>
            </div>

          {/* Teléfono */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                <Phone size={20} className="text-gray-500" />
            </div>
            <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Teléfono</p>
                <p className="font-medium text-[#0F2C59] mt-0.5">
                {user?.telefono}
                </p>
            </div>
            </div>
        </div>

        {/* Actions */}
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

      {/* Change Password Modal */}
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