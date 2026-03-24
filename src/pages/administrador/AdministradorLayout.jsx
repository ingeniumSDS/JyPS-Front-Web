import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { Users, LogOut, Building2, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
//Iconos que usaremos
import {GraduationCap} from 'lucide-react';

export default function AdministradorLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Simulacion de usuario 
    const user = { nombre: "Admin Prueba", rol: "administrador" };

  // Cerrar sidebar al cambiar de ruta en móvil
    useEffect(() => {
    setIsSidebarOpen(false);
    }, [location.pathname]);

    // logica de cerrar sesion
    const handleLogout = () => {
    navigate('/login');
    };

    const navItems = [
    { path: '/administrador', icon: Users, label: 'Gestión de Usuarios' },
    { path: '/administrador/departamentos', icon: Building2, label: 'Gestión de Departamentos' },
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
        {/* Logo / Header Sidebar */}
        <div className="p-4 sm:p-6 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#D4AF37] rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                <GraduationCap size={20} className="text-[#0F2C59] sm:w-6 sm:h-6" />
            </div>
            <div>
                <h1 className="font-bold text-sm sm:text-base leading-tight">Sistema JyPS</h1>
                <p className="text-xs text-gray-300">Administrador</p>
            </div>
            </div>
            <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            >
            <X size={20} />
            </button>
        </div>

        {/* Navigation */}
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

        {/* User / Logout */}
        <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 px-3 sm:px-4 py-3 mb-2 rounded-xl bg-white/5 border border-white/10">
            <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0 border border-[#D4AF37]/30">
                <span className="text-[#D4AF37] font-bold text-sm">
                {user?.nombre?.charAt(0) || 'A'}
                </span>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-white truncate">{user?.nombre}</p>
                <p className="text-[10px] sm:text-xs text-gray-400 truncate">{user?.rol}</p>
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
        {/* Top Bar para móvil */}
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

        {/* (Outlet) */}
        <main className="flex-1 overflow-y-auto bg-[#F8F9FA] p-4 sm:p-6 lg:p-8 relative">
            <Outlet />
        </main>
        </div>
    </div>
    );
}