import { useApi } from '../hooks/useApi';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export const useIncidencias = () => {
    const { request, isLoading, error } = useApi();

       // Crear Pase de Salida (POST /pases)
        const crearPaseSalida = async (datosPase, archivos) => {
        try {
            const formData = new FormData();

            
            const { id, ...datosSinId } = datosPase;

            // 'data' y JSON
            formData.append('data', new Blob([JSON.stringify(datosSinId)], {
                type: 'application/json'
            }));

            if (archivos && archivos.length > 0) {
                archivos.forEach((archivo) => {
                    formData.append('archivos', archivo);
                });
            }

            const resultado = await request('/pases', 'POST', formData);
            return { exito: true, data: resultado };
        } catch (error) {
            toast.error(`Error al crear el pase de salida: ${error.message}`);
            return { exito: false, mensaje: error.message };
        }
    };

    // Solicitar Justificante (POST /justificantes)
    const solicitarJustificante = async (datos, listaArchivos) => {
        try {
            const formData = new FormData();

            // JSON bajo 'Data'
            formData.append('data', new Blob([JSON.stringify(datos)], {
                type: 'application/json'
            }));

            if (listaArchivos && listaArchivos.length > 0) {
                listaArchivos.forEach(file => {
                    formData.append('archivos', file);
                });
            }

            const response = await request('/justificantes', 'POST', formData);
            return { exito: true, data: response };
        } catch (err) {
            toast.error(`Error al solicitar el justificante: ${err.message}`);
            return { exito: false, mensaje: err.message };
        }
    };

    // Obtener Incidencias para Jefe (GET /justificantes/jefe y /pases/jefe)
    const obtenerIncidenciasParaJefe = useCallback(async (jefeId) => {
        if (!jefeId) return [];
        try {
            // Peticiones en paralelo 
            const [justificantes, pases] = await Promise.all([
                request(`/justificantes/jefe?jefeId=${jefeId}`, 'GET'),
                request(`/pases/jefe?jefeId=${jefeId}`, 'GET')
            ]);

            const normalizar = (items, tipo) => (items || []).map(item => ({
                ...item,
                id: item.id, 
                tipo,
                fechaVisual: item.fechaSolicitada || item.fechaSolicitud,
                horaVisual: item.horaSolicitada || null,
                motivoVisual: item.descripcion,
                estado: item.estado ? item.estado.toUpperCase() : 'PENDIENTE' 
            }));

            return [...normalizar(justificantes, 'Justificante'), ...normalizar(pases, 'Pase')];
        } catch (err) {
            toast.error(`Error al obtener las incidencias: ${err.message}`);
            throw err;
        }
    }, [request]);

    // Obtener Incidencias por ID
    const obtenerDetalleIncidencia = async (id, tipo) => {
        const endpoint = tipo.toLowerCase() === 'pase' 
            ? `/pases/${id}/detalles` 
            : `/justificantes/${id}/detalles`;
        try {
            const res = await request(endpoint, 'GET');
            return res; 
        } catch (error) {
            toast.error(`Error al obtener detalles: ${error.message}`);
            throw error;
        }
    };

    // Aprobar o Rechazar
    const revisarIncidencia = async ({ id, tipo, estado, comentario }) => {
        const esJustificante = tipo.toLowerCase() === 'justificante';
        
        const url = esJustificante ? '/justificantes/revisar' : '/pases/revisar';
        const body = {
            estado: estado,
            comentario: comentario || "Revisado por el jefe",
            ...(esJustificante ? { justificanteId: id } : { paseDeSalidaId: id })
        };

        try {
            const res = await request(url, 'PUT', body);
            return res;
        } catch (error) {
            toast.error(`Error al revisar incidencia: ${error.message}`);
            throw error;
        }
    };

    // Descarga y abre un archivo adjunto usando la URL completa
    const descargarArchivoJustificante = async (urlArchivo) => {
        try {
            // construimos la URL
            const url = urlArchivo; 
            
            const token = localStorage.getItem('usuario'); 
            if (!token) {
                toast.error("Tu sesión ha expirado. Vuelve a iniciar sesión.");
                return;
            }

            const respuesta = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!respuesta.ok) {
                throw new Error(`Error HTTP del servidor: ${respuesta.status}`);
            }

            const blob = await respuesta.blob();
            const urlTemporal = URL.createObjectURL(blob);
            window.open(urlTemporal, '_blank');

            setTimeout(() => {
                URL.revokeObjectURL(urlTemporal);
            }, 10000);

        } catch (error) {
            toast.error(`Hubo un error al intentar abrir el archivo: ${error.message}`);
        }
    };

    return {
        obtenerDetalleIncidencia,
        crearPaseSalida,
        solicitarJustificante,
        obtenerIncidenciasParaJefe,
        revisarIncidencia,
        descargarArchivoJustificante,
        isLoadingIncidencias: isLoading, 
        errorIncidencias: error
    };
};