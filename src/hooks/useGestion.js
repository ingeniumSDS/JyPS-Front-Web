import { data } from "react-router";
import { useApi } from "./useApi";

export const useGestion = () => {
    const { request, isLoading } = useApi();

    // --- MÉTODOS DE ESCRITURA (POST / PUT) ---

    // CREAR USUARIO / POST
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

    // ACTUALIZAR USUARIO / PUT 
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

    // CREAR DEPTOS / POST
    const crearDepartamento = async (formData) => {
        try {
            const payload = {
                nombre: formData.nombre.trim(),
                descripcion: formData.descripcion.trim(),
                jefeId: formData.jefeId || 0 
            };
            
            const respuesta = await request('/departamentos', 'POST', payload);
            return { exito: true, data: respuesta };
            
        } catch (err) {
            console.error("Error al crear departamento", err);
            return { exito: false, mensaje: err.message }; 
        }
    };

    // ACTUALIZAR DEPARTAMENTO / PUT

    // ASIGNAR JEFE DEPARTAMENTO / POST
    const asignarUnJefe = async (departamentoId, jefeId) => {
        try {
            // Solo mandamos los IDs sin body, tal como lo marca Swagger
            const respuesta = await request(`/departamentos/${departamentoId}/asignar-jefe?jefeId=${jefeId}`, 'PATCH');
            return { exito: true, data: respuesta };
            
        } catch (err) {
            console.error("Error al asignar jefe al departamento:", err);
            return { exito: false, mensaje: err.message };
        }
    };

    // --- METODOS DE LECTURA (GET) ---

    // OBTENER USUARIOS / GET
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

    // CAMBIO DE ESTADO USUARIO/  PATCH
    const cambiarEstadoUsuario = async (id, estatus) => {
        try {
            const respuesta = await request(`/usuarios/${id}/estado?estatus=${estatus}`, 'PATCH');
            return { exito: true, data: respuesta };
            
        } catch (err) {
            console.error("Error al cambiar estado del usuario:", err);
            return { exito: false, mensaje: err.message };
        }
    };
    
    // OBTENER DEPTOS / GET
    const obtenerDepartamento = async () => {
        try {
            const respuesta = await request('/departamentos', 'GET');
            const departamentosBackend = Array.isArray(respuesta) ? respuesta : (respuesta.data || []);
            
            const departamentosFormateados = departamentosBackend.map(dep => ({
                id: dep.id,
                nombre: dep.nombre,
                descripcion: dep.descripcion,
                jefeId: dep.jefeId,
                nombreJefe: dep.nombreJefe || 'Sin jefe asignado', 
                activo: dep.activo, 
                estado: dep.activo ? 'Activo' : 'Inactivo', 
                totalEmpleados: dep.totalEmpleados || 0 
            }));

            return { exito: true, data: departamentosFormateados };

        } catch (err) {
            console.error('Error al obtener departamentos:', err);
            return { exito: false, mensaje: err.message };
        }
    };

    // TAREA: CAMBIO DE ESTADO DEPTOS/ PATCH

    return {
        asignarUnJefe,
        crearDepartamento,
        cambiarEstadoUsuario,
        isLoading,
        crearUsuario,
        actualizarUsuario,
        obtenerUsuarios,
        obtenerDepartamento
    };
};