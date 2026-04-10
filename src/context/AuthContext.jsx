import { createContext, useContext, useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi'; 

// CONTEXT 
const AuthContext = createContext();

// PROVIDER 
export const AuthProvider = ({ children }) => {
    
    // ESTADOS 
    const [user, setUser] = useState(null);
    const [isLoadingSession, setIsLoadingSession] = useState(true);
    const { request } = useApi();

    //  LOGICA: DATOS 
    const cargarDatosDelUsuario = async (tokenGuardado) => {
        try {
            const payload = JSON.parse(atob(tokenGuardado.split('.')[1]));
            const usuarioId = payload.id; 

            const datosDelBackend = await request(`/usuarios/${usuarioId}`, 'GET');
            
            setUser({
                id: usuarioId,
                nombre: datosDelBackend.nombreCompleto || "Sin Nombre",
                rol: (datosDelBackend.roles && datosDelBackend.roles[0]) || "Usuario",
                email: datosDelBackend.correo || "Sin Correo",
                telefono: datosDelBackend.telefono || "Sin Teléfono",
                departamentoId: datosDelBackend.departamentoId
            });

        } catch (error) {
            console.error(" Falló la conexion con el Backend:", error);

            setUser({
                nombre: "Modo Fallback (Sin Backend)",
                rol: "Administrador",
                email: "error@conexion.com",
                telefono: "000-0000"
            });

        } finally {
            setIsLoadingSession(false);
        }
    };

    // EFECTOS 
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            cargarDatosDelUsuario(token);
        } else {
            setIsLoadingSession(false);
        }
    }, []);

    // HANDLERS: SESION 
    const iniciarSesion = async (nuevoToken) => {
        localStorage.setItem('token', nuevoToken);
        setIsLoadingSession(true);
        await cargarDatosDelUsuario(nuevoToken);
    };

    const cerrarSesion = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    // RENDER 
    return (
        <AuthContext.Provider value={{ user, isLoadingSession, iniciarSesion, cerrarSesion }}>
            {children}
        </AuthContext.Provider>
    );
};

// CUSTOM HOOK 
export const useAuth = () => {
    return useContext(AuthContext);
};