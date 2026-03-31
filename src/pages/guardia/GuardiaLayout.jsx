import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { LogOut, Shield } from 'lucide-react';

export default function GuardiaLayout() {
    const navigate = useNavigate();

    // Usuario hardcodeado 
    const user = {
        nombre: 'Roberto Gómez (Turno Matutino)',
        rol: 'seguridad'
    };

    const handleLogout = () => {
        alert('Simulando cierre de sesión...');
        navigate('/login');
    };

    return (
    <div className="min-h-screen bg-[#F8F9FA]"> 
        <header className="bg-[#0F2C59] text-white p-4 shadow-lg sticky top-0 z-50">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                <div className="flex items-center gap-3">
                <Shield size={32} />
                <div>
                    <h1 className="text-xl font-bold">Sistema de Seguridad</h1>
                    <p className="text-sm text-gray-200">{user.nombre}</p>
                </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
                >
                <span className="hidden sm:inline text-sm">Cerrar Sesión</span>
                <LogOut size={20} />
                </button>
            </div>
        </header>

      {/* Content */}
        <main className="max-w-7xl mx-auto p-4 sm:p-6">
            <Outlet />
        </main>
    </div>
    );
}