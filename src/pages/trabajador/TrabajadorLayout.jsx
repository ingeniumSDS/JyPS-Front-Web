import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, LayoutGrid, FileText, User, GraduationCap, LogOut } from 'lucide-react';

export default function TrabajadorLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    // Simulacion de usuario
    const user = { nombre: "Trabajador Prueba", rol: "trabajador" };

    //cerrar sesion logica
    const handleLogout = () => {
        navigate('/login');
    };

    // Navegaciones
    const menuItems = [
        { id: 'dashboard', path: '/trabajador', icon: Home, label: 'Inicio' },
        { id: 'reportes', path: '/trabajador/reportes', icon: FileText, label: 'Historial' },
        { id: 'perfil', path: '/trabajador/perfil', icon: User, label: 'Perfil' }
    ];

    return (
    <div className="min-h-screen bg-[#F8F9FA] flex">

        {/* SIDEBAR DESKTOP*/}
        <aside className="hidden lg:flex w-64 bg-[#0F2C59] text-white flex-col z-50 sticky top-0 h-screen">
        
        {/* Logo - encabezado */}
        <div className="p-4 sm:p-6 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#D4AF37] rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                <GraduationCap size={20} className="text-[#0F2C59] sm:w-6 sm:h-6" />
            </div>
            <div>
                <h1 className="font-bold text-sm sm:text-base leading-tight">Sistema JyPS</h1>
                <p className="text-xs text-gray-300 capitalize">{user.rol}</p>
            </div>
            </div>
        </div>

        {/* navegacion */}
        <nav className="flex-1 py-4 sm:py-6 px-3 sm:px-4 space-y-1 sm:space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path === '/trabajador' && location.pathname === '/trabajador/dashboard');
            
            return (
                <Link
                key={item.id}
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

        {/* cerrar sesion */}
        <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 px-3 sm:px-4 py-3 mb-2 rounded-xl bg-white/5 border border-white/10">
            <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0 border border-[#D4AF37]/30">
                <span className="text-[#D4AF37] font-bold text-sm">
                {user.nombre.charAt(0)}
                </span>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-white truncate">{user.nombre}</p>
                <p className="text-[10px] sm:text-xs text-gray-400 truncate capitalize">{user.rol}</p>
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

        {/* CONTENIDO PRINCIPAL*/}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/*TOP BAR MOVIL) */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
            <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#D4AF37] rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-[#0F2C59] font-bold text-sm">J</span>
            </div>
            <span className="font-semibold text-[#0F2C59] text-base truncate">Sistema JyPS</span>
            </div>
          {/*Cerrar sesion movil */}
            <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
            <LogOut size={20} />
            </button>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#F8F9FA] p-4 sm:p-6 lg:p-8 relative pb-20 lg:pb-8">
            <Outlet />
        </main>

        </div>
        {/* BOTTOM NAV Oculto en desktop */}
        <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around items-center px-2 py-3 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe">
        {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path === '/trabajador' && location.pathname === '/trabajador/dashboard');

            return (
            <Link
                key={item.id}
                to={item.path}
                className="flex flex-col items-center gap-1 w-16"
            >
                <div className={`p-2 rounded-xl transition-all duration-200 ${
                isActive ? 'bg-[#D4AF37]/20 text-[#0F2C59]' : 'text-gray-400 hover:text-gray-600'
                }`}>
                <Icon size={22} className={isActive ? 'text-[#0F2C59]' : ''} />
                </div>
                <span className={`text-[px] font-medium text-center w-full truncate ${
                isActive ? 'text-[#0F2C59] font-bold' : 'text-gray-500'
                }`}>
                {item.label}
                </span>
            </Link>
            );
        })}
        </nav>

    </div>
    );
}