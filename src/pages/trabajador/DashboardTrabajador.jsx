import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '../../components/Card';
import { FileText, LogOut as DoorOpen, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function DashboardTrabajador() {
    const navigate = useNavigate();
    const location = useLocation();
    
    //  Extraemos el usuario real desde el AuthContext
    const { user } = useAuth();

    // Lógica de detección de rol para navegación
    const isAdmin = location.pathname.includes('/administrador');
    const isRRHH = location.pathname.includes('/recursos-humanos');
    const isJefe = location.pathname.includes('/jefe-area');
    
    let basePath = '/trabajador'; 
    if (isAdmin) basePath = '/administrador';
    else if (isRRHH) basePath = '/recursos-humanos';
    else if (isJefe) basePath = '/jefe-area';

    return (
        <div className="pb-6 sm:pb-8 animate-fade-in mx-auto max-w-7xl px-2 sm:px-4">

            {/* HEADER CON DATOS REALES */}
            <div className="bg-gradient-to-r from-[#0F2C59] to-[#1a4178] text-white p-5 sm:p-6 rounded-lg mb-3 shadow-lg">
                <h1 className="text-xl sm:text-2xl font-bold mb-1.5 leading-tight">
                    ¡Bienvenido de nuevo!
                </h1>
                {/* 3. Usamos el operador ?. para evitar errores si user es null momentáneamente */}
                <p className="text-sm sm:text-base text-white/90 break-words">
                    {user?.nombre || "Usuario"}
                </p>
                <div className="flex flex-col sm:flex-row sm:gap-4 mt-1">
                    <p className="text-xs sm:text-sm text-white/70 mt-1 break-all">
                        {user?.email}
                    </p>
                    {user?.departamento && (
                        <p className="text-xs sm:text-sm text-white/60 font-semibold uppercase">
                            • {user.departamento}
                        </p>
                    )}
                </div>
            </div>

            {/* ACTION CARDS */}
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-3">
                
                {/* Pase de Salida */}
                <Card 
                    className="p-4 sm:p-5 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-t-[#0F2C59]"
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