import { useApi } from './useApi';

export const useUsuarios = () => {

    const { request, isLoading } = useApi();

    // FUNCION DE LOGIN 
    const loginUsuario = async (correo, contrasena) => {
        try {
            const payload = { 
                correo: correo, 
                password: contrasena 
            };
            
            console.log("Enviando este JSON al backend:", payload); // Para que lo veas en consola

            const respuesta = await request('/usuarios/login', 'POST', payload);
            
            return { exito: true, data: respuesta };
            
        } catch (err) {
            console.error("Error en el login:", err);
            return { exito: false, mensaje: err.message }; 
        }
    };
   // SOLICITAR RECUPERACIÓN (Envía el correo)
    const solicitarRecuperacion = async (correo) => {
        try {
            // ¡Corregido! Ahora apuntamos a /usuarios/token según tu Swagger
            const data = await request('/usuarios/token', 'POST', { correo });
            return { exito: true, data, mensaje: data.mensaje || "Solicitud procesada" };
        } catch (error) {
            console.error("Error en solicitarRecuperacion:", error);
            return { exito: false, mensaje: error.message || "Error de conexión con el servidor" };
        }
    }
    // VERIFICAR TOKEN (Control de acceso)
    const verificarToken = async (token) => {
        try {
            const data = await request(`/usuarios/setup/validar?token=${token}`, 'GET');
            return { exito: true, data, mensaje: data.mensaje || "Token verificado" };
        } catch (error) {
            console.error("Error en verificarToken:", error);
            return { exito: false, mensaje: error.message || "Error al verificar el enlace" };
        }
    };
    // RESTABLECER CONTRASEÑA (Guardar la nueva)
    const restablecerContrasena = async (token, nuevaContrasena) => {
        try {
            const payload = { 
                token: token, 
                password: nuevaContrasena 
            };
            const data = await request('/usuarios/setup', 'POST', payload);
            return { exito: true, data, mensaje: data.mensaje || "Contraseña actualizada exitosamente" };
        } catch (error) {
            console.error("Error en restablecerContrasena:", error);
            return { exito: false, mensaje: error.message || "Error al guardar la nueva contraseña" };
        }
    };

    return { 
        solicitarRecuperacion,
        verificarToken,
        restablecerContrasena,
        loginUsuario,
        isLoading 
    };
};

