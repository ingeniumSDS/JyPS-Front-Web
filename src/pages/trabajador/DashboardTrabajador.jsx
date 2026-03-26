import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '../../components/Card';
import { FileText, LogOut as DoorOpen, Info } from 'lucide-react';

export default function DashboardTrabajador() {
    const navigate = useNavigate();
    const location = useLocation();

    // LOGICA DE NAVEGACIÓN CORREGIDA 
    // Detectamos el rol
    const isAdmin = location.pathname.includes('/administrador');
    const isRRHH = location.pathname.includes('/recursos-humanos');
    
    // Definimos la RUTA BASE 
    let basePath = '/trabajador'; 

    if (isAdmin) {
        basePath = '/administrador';
    } else if (isRRHH) {
        basePath = '/recursos-humanos'; 
    }


    // Simulacion del usuario 
    const user = { 
        nombre: "Juan Pérez García", 
        email: "juan.perez@utez.edu.mx" 
    };

    return (
    <div className="pb-6 sm:pb-8 animate-fade-in mx-auto max-w-7xl px-2 sm:px-4">

      {/* HEADER  */}
      <div className="bg-gradient-to-r from-[#0F2C59] to-[#1a4178] text-white p-5 sm:p-6 rounded-lg mb-3 shadow-lg">
        <h1 className="text-xl sm:text-2xl font-bold mb-1.5 leading-tight">¡Bienvenido de nuevo!</h1>
        <p className="text-sm sm:text-base text-white/90 break-words">{user.nombre}</p>
        <p className="text-xs sm:text-sm text-white/70 mt-1 break-all">{user.email}</p>
      </div>


      {/* ACTION CARDS  */}
      <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-3">
        
        {/* Pase de Salida */}
        <Card 
            className="p-4 sm:p-5 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-t-[#0F2C59]"
            /* CAMBIO AQUÍ: Ahora basePath sí existe y concatenará la ruta correcta */
            onClick={() => navigate(`${basePath}/solicitar-pase`)}
        >
            <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-[#0F2C59] rounded-full flex items-center justify-center mb-2 shadow-md">
                <DoorOpen size={30} className="text-white sm:w-8 sm:h-8 ml-1" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[#0F2C59] mb-1">
                Pase de Salida
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
                Solicita un pase para salir durante el horario laboral
            </p>
            </div>
        </Card>

        {/* Justificante */}
        <Card 
            className="p-4 sm:p-5 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-t-[#28A745]"
            /* CAMBIO AQUÍ: Ahora basePath sí existe y concatenará la ruta correcta */
            onClick={() => navigate(`${basePath}/solicitar-justificante`)}
        >
            <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-[#28A745] rounded-full flex items-center justify-center mb-2 shadow-md">
                <FileText size={30} className="text-white sm:w-8 sm:h-8" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[#0F2C59] mb-1">
                Justificante
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
                Justifica una falta o inasistencia
            </p>
            </div>
        </Card>
      </div>

      {/* INFO CARD */}
      <Card className="p-4 bg-blue-50/50 border border-blue-100">
        <h3 className="font-semibold text-[#0F2C59] mb-2 text-sm sm:text-base flex items-center gap-2">
            <Info size={18} className="text-[#0F2C59]" />
            Información Importante
        </h3>
        <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
            <li className="flex items-start gap-2">
            <span className="text-[#0F2C59] font-bold">•</span>
            <span>Las solicitudes deben ser aprobadas por un administrador.</span>
            </li>
            <li className="flex items-start gap-2">
            <span className="text-[#0F2C59] font-bold">•</span>
            <span>Tu código QR será activado una vez aprobada tu solicitud.</span>
            </li>
            <li className="flex items-start gap-2">
            <span className="text-[#0F2C59] font-bold">•</span>
            <span>Presenta el QR al personal de seguridad al salir.</span>
            </li>
            <li className="flex items-start gap-2">
            <span className="text-[#0F2C59] font-bold">•</span>
            <span>Revisa tu historial para ver el estado de tus solicitudes.</span>
            </li>
        </ul>
      </Card>

    </div>
   );
}