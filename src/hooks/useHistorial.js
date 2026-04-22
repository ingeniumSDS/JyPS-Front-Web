import { useState } from 'react';
import { useApi } from './useApi';
import { data } from 'react-router';

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

    // Descarga y abre un archivo adjunto con URL completa, ruta relativa o nombre de archivo.
    const descargarArchivoJustificante = async (empleadoId, archivoRef) => {
        try {
            const baseUrl = (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/$/, '');

            if (!archivoRef) {
                throw new Error('Referencia de archivo no valida.');
            }

            const esUrlAbsoluta = /^https?:\/\//i.test(archivoRef);
            const esRutaRelativa = archivoRef.startsWith('/');

            let url = archivoRef;
            if (!esUrlAbsoluta && !esRutaRelativa) {
                const nombreArchivo = archivoRef.split('/').pop();
                if (!empleadoId || !nombreArchivo) {
                    throw new Error('No se pudo construir la URL de descarga.');
                }
                const archivoCodificado = encodeURIComponent(nombreArchivo);
                url = `${baseUrl}/justificantes/${empleadoId}/${archivoCodificado}`;
            }

            // Evita mixed content cuando el front corre en HTTPS y el backend devuelve URL HTTP.
            if (esUrlAbsoluta) {
                const parsedUrl = new URL(archivoRef);
                const frontEnHttps = window.location.protocol === 'https:';
                const backendEnHttp = parsedUrl.protocol === 'http:';

                if (frontEnHttps && backendEnHttp) {
                    if (parsedUrl.pathname.startsWith('/api/')) {
                        url = `${parsedUrl.pathname}${parsedUrl.search}`;
                    } else {
                        url = archivoRef.replace(/^http:/i, 'https:');
                    }
                }
            }
            
            // Verificacion del token
            const token = localStorage.getItem('usuario'); 
            if (!token) {
                throw new Error('Tu sesion ha expirado. Vuelve a iniciar sesion.');
            }

            // obtener el binario del archivo
            const respuesta = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'ngrok-skip-browser-warning': 'true'
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
            throw error;
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

     //Cambiar esstado a revocar
    const revocarPaedesalida = async (id) =>{
        setCargando(true)
        try{
            const endponit = `/pases/${id}/revocar`;
            const respuesta = await request(endponit, 'PATCH');
            return {exito: true, data: request};
        }catch (err){
            console.error(`Error al eliminar el pase ${id}:`, err);
            return { exito: false, mensaje: error.message };
        }finally{
            setCargando(false);
        }
    };

    return {
        revocarPaedesalida,
        obtenerPasesEmpleado,
        cargando,
        obtenerJustificantesEmpleado,
        obtenerDetallesJustificante,
        descargarArchivoJustificante,
        eliminarPase,         
        eliminarJustificante 
    };
};