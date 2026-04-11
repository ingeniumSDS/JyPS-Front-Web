import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

// Decodifica el payload de un token JWT a un objeto JSON
const decodificarJwt = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Error en parsing de JWT:", error);
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); 

    useEffect(() => {
        const revisarSesion = async () => {
            try {
                // Recupera el token crudo para validar existencia
                const tokenGuardado = localStorage.getItem("usuario");
                
                if (tokenGuardado) {
                    // Extrae los claims del payload para autorización
                    const usuarioDecodificado = decodificarJwt(tokenGuardado);
                    
                    if (usuarioDecodificado) {
                        setUser(usuarioDecodificado); // Hidrata el estado
                    } else {
                        localStorage.removeItem("usuario"); // Purga tokens corruptos
                    }
                }
            } catch (error) {
                console.error("Error durante la inicialización de sesión:", error);
            } finally {
                setIsLoading(false); // Libera el renderizado de la UI
            }
        };

        revisarSesion();
    }, []);

    const iniciarSesion = (tokenPuro) => {
        // Extrae claims para manejo de RBAC (Role-Based Access Control)
        const usuarioDecodificado = decodificarJwt(tokenPuro);
        setUser(usuarioDecodificado); 
        
        // Persiste el token crudo para su inyección en headers HTTP
        localStorage.setItem("usuario", tokenPuro); 
    };

    const cerrarSesion = () => {
        setUser(null);
        localStorage.removeItem("usuario");
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, iniciarSesion, cerrarSesion }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);