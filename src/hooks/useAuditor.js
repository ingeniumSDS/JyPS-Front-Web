import { useState } from 'react';
import { useApi } from "./useApi";

export const useAuditor = () => {
    // Solo extraemos request de useApi
    const { request } = useApi(); 
    
    // AÑADIMOS EL ESTADO
    const [cargando, setCargando] = useState(false); 

    const obtenerJustificantes = async (fechaInicio, fechaFin) => {
        setCargando(true); 
        try {
            // 1. La URL ya no lleva los parámetros (?)
            const url = '/justificantes/rango-fechas';
            
            // 2. Armamos el cuerpo (Request body) exacto como lo pide Swagger
            const body = { 
                fechaInicio: fechaInicio, 
                fechaFin: fechaFin 
            };
            
            // 3. Cambiamos a POST y mandamos el body
            const respuesta = await request(url, 'POST', body);
            
            const justificantes = Array.isArray(respuesta) ? respuesta : (respuesta.data || []);
            return { exito: true, data: justificantes };
        } catch (err) {
            console.error('Error al obtener justificantes:', err);
            return { exito: false, data: [] };
        } finally {
            setCargando(false); 
        }
    };

    const obtenerPases = async (fechaInicio, fechaFin) => {
        setCargando(true); 
        try {
            // 1. URL limpia
            const url = '/pases/rango-fechas';
            
            // 2. Request body
            const body = { 
                fechaInicio: fechaInicio, 
                fechaFin: fechaFin 
            };
            
            // 3. POST + body
            const respuesta = await request(url, 'POST', body);
            
            const pases = Array.isArray(respuesta) ? respuesta : (respuesta.data || []);
            return { exito: true, data: pases };
        } catch (err) {
            console.error('Error al obtener pases:', err);
            return { exito: false, data: [] };
        } finally {
            setCargando(false); 
        }
    };

    return { 
        obtenerPases,
        obtenerJustificantes,
        cargando 
    };
};