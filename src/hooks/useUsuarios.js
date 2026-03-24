import { useApi } from './useApi';

export const useUsuarios = () => {

    const { request, isLoading } = useApi();

    //POST
    const crearUsuario = async (formData) => {
        try {
            //JSON
            const payload = {
                nombre: formData.nombre,
                apellidoPaterno: formData.apellidoPaterno,
                apellidoMaterno: formData.apellidoMaterno,
                correo: formData.correo,
                telefono: formData.telefono,
                horaEntrada: `${formData.horaEntrada}:00`,
                horaSalida: `${formData.horaSalida}:00`,
                roles: formData.roles,
                departamentoId: Number(formData.departamentoId) 
            };
            const respuesta = await request('/usuarios', 'POST', payload);
            return { exito: true, data: respuesta };
            
        } catch (err) {
            console.error("Error en useUsuarios:", err);
            return { exito: false, mensaje: err.message };
        }
    };

    //GET
    const obtenerUsuarios = async () => {
        try {
            const respuesta = await request('/usuarios', 'GET');
            
            console.log("Datos puros del backend:", respuesta);

            // Verificamos
            const usuariosBackend = Array.isArray(respuesta) ? respuesta : (respuesta.data || []);

            const usuariosFormateados = usuariosBackend.map(user => ({
                id: user.id || Math.random().toString(),
                nombreCompleto: user.nombreCompleto,
                email: user.correo,
                rol: user.roles && user.roles.length > 0 ? user.roles[0].toLowerCase() : 'sin_rol',
                //Departamento  
                departamento: user.departamento ? user.departamento.nombre : `Depto ${user.departamentoId}`,
                telefono: user.telefono,
                isActive: user.estatus !== undefined ? user.estatus : true 
            }));

            return { exito: true, data: usuariosFormateados };

        } catch (err) {
            console.error("Error en useUsuarios (obtener):", err);
            return { exito: false, mensaje: err.message };
        }
    };

    return { 
        crearUsuario,
        obtenerUsuarios, 
        isLoading 
    };
};

