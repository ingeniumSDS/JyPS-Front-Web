import { useState } from 'react';
import { useApi } from './useApi';

export const useHistorial = () => {
    const { request } = useApi();
    const [cargando, setCargando] = useState(false);

     //Obtiene la lista de justificantes de un empleado
    const obtenerJustificantesEmpleado = async (empleadoId) => {
        setCargando(true);
        try {
            const endpoint = `/justificantes/empleado?empleadoId=${empleadoId}`;
            const respuesta = await request(endpoint, 'GET');
            
            const data = Array.isArray(respuesta) ? respuesta : (respuesta?.data || []);
            return { exito: true, data };
        } catch (error) {
            console.error('Error al obtener justificantes del empleado:', error);
            return { exito: false, data: [], mensaje: error.message };
        } finally {
            setCargando(false);
        }
    };

    // Obtiene los detalles especificos de un justificante.
    const obtenerDetallesJustificante = async (id) => {
        setCargando(true);
        try {
            const endpoint = `/justificantes/${id}/detalles`;
            const respuesta = await request(endpoint, 'GET');
            
            const data = respuesta?.data || respuesta;
            return { exito: true, data };
        } catch (error) {
            console.error(`Error al obtener detalles del justificante ${id}:`, error);
            return { exito: false, data: null, mensaje: error.message };
        } finally {
            setCargando(false);
        }
    };

    //Descarga y abre un archivo adjunto en una nueva pestaña.
    const descargarArchivoJustificante = async (empleadoId, nombreArchivoGuardado) => {
        try {
            const baseUrl = import.meta.env.VITE_API_BASE_URL; 
            const url = `${baseUrl}/justificantes/${empleadoId}/${nombreArchivoGuardado}`;
            
            // Verificacion del token
            const token = localStorage.getItem('usuario'); 
            if (!token) {
                console.error("JWT no encontrado bajo la clave 'usuario'.");
                alert("Tu sesión ha expirado. Vuelve a iniciar sesión.");
                return;
            }

            // obtener el binario del archivo
            const respuesta = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!respuesta.ok) {
                throw new Error(`Error HTTP del servidor: ${respuesta.status}`);
            }

            // Generacion de URL 
            const blob = await respuesta.blob();
            const urlTemporal = URL.createObjectURL(blob);

            // Apertura del archivo
            window.open(urlTemporal, '_blank');

            // Liberación de memoria 
            setTimeout(() => {
                URL.revokeObjectURL(urlTemporal);
            }, 10000);

        } catch (error) {
            console.error("Error al descargar el archivo:", error);
            alert(`Hubo un error al intentar abrir el archivo: ${error.message}`);
        }
    };

    // obtener los pases del empleado 
    const obtenerPasesEmpleado = async (empleadoId) => {
        setCargando(true); 
        try {
            
            const endpoint = `/pases/empleado?empleadoId=${empleadoId}`;
            
            const respuesta = await request(endpoint, 'GET');
            
            const data = Array.isArray(respuesta) ? respuesta : (respuesta?.data || []);
            
            return { exito: true, data };
            
        } catch (error) {
            console.error("Error al obtener pases:", error);
            return { exito: false, data: [] };
        } finally {
            setCargando(false); // Detenemos la carga ocurra lo que ocurra
        }
    };

    // Eliminar un pase estado "pendiente"
    const eliminarPase = async (id) => {
        setCargando(true);
        try {
            const endpoint = `/pases/${id}`;
            const respuesta = await request(endpoint, 'DELETE');
            return { exito: true, data: respuesta };
        } catch (error) {
            console.error(`Error al eliminar el pase ${id}:`, error);
            return { exito: false, mensaje: error.message };
        } finally {
            setCargando(false);
        }
    };

    // Eliminar un justificante estado "pendiente"
    const eliminarJustificante = async (id) => {
        setCargando(true);
        try {
            const endpoint = `/justificantes/${id}`;
            const respuesta = await request(endpoint, 'DELETE');
            return { exito: true, data: respuesta };
        } catch (error) {
            console.error(`Error al eliminar el justificante ${id}:`, error);
            return { exito: false, mensaje: error.message };
        } finally {
            setCargando(false);
        }
    };

    return {
        obtenerPasesEmpleado,
        cargando,
        obtenerJustificantesEmpleado,
        obtenerDetallesJustificante,
        descargarArchivoJustificante,
        eliminarPase,         
        eliminarJustificante 
    };
};