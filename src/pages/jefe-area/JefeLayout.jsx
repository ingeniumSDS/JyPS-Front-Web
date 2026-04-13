import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { 
    History,
    FilePlus,
    LogOut, 
    Menu, 
    X, 
    LayoutDashboard, 
    Users, 
    User as UserIcon, // Renombrado para evitar conflicto con el objeto user
    GraduationCap 
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; // Importamos el contexto

export default function JefeLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // Extraemos el usuario real y la función de cierre de sesión
    const { user, cerrarSesion } = useAuth(); 

    // Formateamos el rol 
    const rolFormateado = user?.roles?.[0]?.replace(/_/g, ' ') || "Jefe de Área";
    // Extraemos el nombre 
    const nombreUsuario = user?.nombre || user?.sub || "Usuario";

    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        cerrarSesion(); // Limpiamos el localStorage y el estado
        navigate('/login');
    };

    const navItems = [
        { path: '/jefe-area', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/jefe-area/trabajadores', icon: Users, label: 'Trabajadores' },
        { path: '/jefe-area/crear-solicitud', icon: FilePlus, label: 'Generar Solicitud' },
        { path: '/jefe-area/historial', icon: History, label: 'Historial' },
        { path: '/jefe-area/perfil', icon: UserIcon, label: "Perfil"}
    ];

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex">
            {/* Overlay para móvil */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:sticky top-0 h-screen w-64 bg-[#0F2C59] text-white flex flex-col z-50
                transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-4 sm:p-6 flex items-center justify-between border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#D4AF37] rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                            <GraduationCap size={20} className="text-[#0F2C59] sm:w-6 sm:h-6" />
                        </div>
                        <div>
                            <h1 className="font-bold text-sm sm:text-base leading-tight">Sistema JyPS</h1>
                            <p className="text-xs text-gray-300 capitalize">{rolFormateado.toLowerCase()}</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 py-4 sm:py-6 px-3 sm:px-4 space-y-1 sm:space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`
                                    flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-200 group text-sm sm:text-base
                                    ${isActive 
                                        ? 'bg-[#D4AF37] text-[#0F2C59] font-semibold shadow-md' 
                                        : 'text-gray-300 hover:bg-white/10 hover:text-white'}
                                `}
                            >
                                <Icon size={18} className={`flex-shrink-0 ${isActive ? 'text-[#0F2C59]' : 'text-gray-400 group-hover:text-white'}`} />
                                <span className="truncate">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Perfil y Cerrar Sesión */}
                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 px-3 sm:px-4 py-3 mb-2 rounded-xl bg-white/5 border border-white/10">
                        <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0 border border-[#D4AF37]/30">
                            <span className="text-[#D4AF37] font-bold text-sm">
                                {nombreUsuario.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-white truncate">{nombreUsuario}</p>
                            <p className="text-[10px] sm:text-xs text-gray-400 truncate capitalize">{rolFormateado.toLowerCase()}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors text-xs sm:text-sm"
                    >
                        <LogOut size={16} className="flex-shrink-0" />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <header className="lg:hidden bg-white border-b border-gray-200 px-3 sm:px-4 py-2 flex items-center gap-2 sticky top-0 z-30">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                    >
                        <Menu size={20} className="text-[#0F2C59]" />
                    </button>
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="w-7 h-7 bg-[#D4AF37] rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-[#0F2C59] font-bold text-xs">J</span>
                        </div>
                        <span className="font-semibold text-[#0F2C59] text-sm truncate">Sistema JyPS</span>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto bg-[#F8F9FA] p-4 sm:p-6 lg:p-8 relative">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}