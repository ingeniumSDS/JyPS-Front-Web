import { useApi } from './useApi';

export const useUsuarios = () => {
    const { request, isLoading } = useApi();

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

    return { 
        crearUsuario, 
        isLoading 
    };
};