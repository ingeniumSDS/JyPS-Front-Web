import { useApi } from "./useApi";

export const useGestion = () => {
    const { request, isLoading } = useApi();

    // --- MÉTODOS DE ESCRITURA (POST / PUT) ---

    // Crea un nuevo usuario
    const crearUsuario = async (formData) => {
        try {
            const payload = {
                nombre: formData.nombre.trim(),
                apellidoPaterno: formData.apellidoPaterno.trim(),
                apellidoMaterno: formData.apellidoMaterno.trim(),
                correo: formData.correo.trim(),
                telefono: formData.telefono,
                horaEntrada: `${formData.horaEntrada}:00`,
                horaSalida: `${formData.horaSalida}:00`,
                roles: Array.isArray(formData.roles) ? formData.roles : [formData.roles],
                departamentoId: Number(formData.departamentoId) 
            };

            const respuesta = await request('/usuarios', 'POST', payload);
            return { exito: true, data: respuesta };
            
        } catch (err) {
            console.error("Error al crear usuario:", err);
            return { exito: false, mensaje: err.message };
        }
    };

    // Actualiza los datos de un usuario existente
    const actualizarUsuario = async (id, formData) => {
        try {
            const payload = {
                nombre: formData.nombre.trim(),
                apellidoPaterno: formData.apellidoPaterno.trim(),
                apellidoMaterno: formData.apellidoMaterno.trim(),
                correo: formData.correo.trim(),
                telefono: formData.telefono,
                horaEntrada: `${formData.horaEntrada}:00`,
                horaSalida: `${formData.horaSalida}:00`,
                roles: Array.isArray(formData.roles) ? formData.roles : [formData.roles],
                departamentoId: formData.departamentoId ? Number(formData.departamentoId) : null
            };

            const respuesta = await request(`/usuarios/${id}`, 'PUT', payload);
            return { exito: true, data: respuesta };
            
        } catch (err) {
            console.error("Error al actualizar usuario:", err);
            return { exito: false, mensaje: err.message };
        }
    };

    // --- MÉTODOS DE LECTURA (GET) ---

    // Obtiene y formatea la lista de todos los usuarios
    const obtenerUsuarios = async () => {
        try {
            const respuesta = await request('/usuarios', 'GET');
            const usuariosBackend = Array.isArray(respuesta) ? respuesta : (respuesta.data || []);

            const usuariosFormateados = usuariosBackend.map(user => ({
                id: user.id || Math.random().toString(),
                nombreCompleto: user.nombreCompleto,
                email: user.correo,
                rol: user.roles && user.roles.length > 0 ? user.roles[0].toLowerCase() : 'sin_rol',
                departamento: user.departamento ? user.departamento.nombre : `Depto ${user.departamentoId}`,
                telefono: user.telefono,
                isActive: user.activo !== undefined ? user.activo : true
            }));

            return { exito: true, data: usuariosFormateados };

        } catch (err) {
            console.error("Error al obtener usuarios:", err);
            return { exito: false, mensaje: err.message };
        }
    };

    // Cambia el estado (activo/inactivo) de un usuario mediante PATCH
    const cambiarEstadoUsuario = async (id, estatus) => {
        try {
            const respuesta = await request(`/usuarios/${id}/estado?estatus=${estatus}`, 'PATCH');
            return { exito: true, data: respuesta };
            
        } catch (err) {
            console.error("Error al cambiar estado del usuario:", err);
            return { exito: false, mensaje: err.message };
        }
    };
    const obtenerDepartamento = async () => {
        try {
            const respuesta = await request('/departamentos', 'GET');
            const departamentosBackend = Array.isArray(respuesta) ? respuesta : (respuesta.data || []);
            
            const departamentosFormateados = departamentosBackend.map(dep => ({
                id: dep.id || Math.random().toString(),
                nombre: dep.nombre,
                descripcion: dep.descripcion,
                jefeId: dep.jefeId
            }));

            return { exito: true, data: departamentosFormateados };

        } catch (err) {
            console.error('Error al obtener departamentos:', err);
            return { exito: false, mensaje: err.message };
        }
    };

    return {
        cambiarEstadoUsuario,
        isLoading,
        crearUsuario,
        actualizarUsuario,
        obtenerUsuarios,
        obtenerDepartamento
    };
};