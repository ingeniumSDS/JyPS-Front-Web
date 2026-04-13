import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; 

export default function RutaProtegida({ children, rolesPermitidos }) {
    const { user, isLoading } = useAuth(); 

    // Manejo de estado de carga inicial
    if (isLoading) {
        return <div className="h-screen flex items-center justify-center">Cargando...</div>;
    }

    // Redireccion si no existe una sesión activa
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Extraccion segura de roles (fallback a arreglo vacío)
    const rolesDelUsuario = user.roles || []; 

    // Validación de RBAC (intersección de roles)
    const tienePermiso = rolesPermitidos 
        ? rolesPermitidos.some(rol => rolesDelUsuario.includes(rol)) 
        : true; 

    // Interfaz de fallback para accesos no autorizados (HTTP 403)
    if (!tienePermiso) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <h1 className="text-4xl font-bold text-blue-900 mb-4">403 - Acceso Denegado</h1>
                <p className="text-xl">No tienes permisos para ver esta página.</p>
                
                <button 
                    onClick={() => window.history.back()} 
                    className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Regresar
                </button>
            </div>
        );
    }

    // Renderizado del componente autorizado
    return children;
}