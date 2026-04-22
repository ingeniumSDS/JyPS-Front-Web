import { useApi } from '../hooks/useApi';
import { useState, useCallback } from 'react';

export const useIncidencias = () => {
    const { request, isLoading, error } = useApi();

    const normalizarNombreArchivo = (nombreArchivo) => {
        if (!nombreArchivo) return '';
        let normalizado = nombreArchivo;
        for (let i = 0; i < 3; i++) {
            try {
                const decodificado = decodeURIComponent(normalizado);
                if (decodificado === normalizado) break;
                normalizado = decodificado;
            } catch {
                break;
            }
        }
        return normalizado;
    };

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
            console.error("Error en crearPaseSalida:", error);
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
            console.error("Error en solicitarJustificante:", err);
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
            console.error("Error en obtenerIncidenciasParaJefe:", err);
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
            console.error("Error al obtener detalles:", error);
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
            console.error("Error al revisar incidencia:", error);
            throw error;
        }
    };

    // Descarga y abre un archivo adjunto usando URL completa, ruta relativa o nombre de archivo.
    const descargarArchivoJustificante = async (archivoRef, empleadoId = null) => {
        try {
            if (!archivoRef) {
                throw new Error('Referencia de archivo no valida.');
            }

            const baseUrl = (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/$/, '');
            const esUrlAbsoluta = /^https?:\/\//i.test(archivoRef);
            const esRutaRelativa = archivoRef.startsWith('/');

            let url = archivoRef;
            let urlsDeDescarga = [url];

            // Si solo viene el nombre del archivo, construimos la ruta de descarga.
            if (!esUrlAbsoluta && !esRutaRelativa) {
                const nombreArchivo = archivoRef.split('/').pop();
                if (!empleadoId || !nombreArchivo) {
                    throw new Error('No se pudo construir la URL de descarga.');
                }
                const nombreNormalizado = normalizarNombreArchivo(nombreArchivo);
                const archivoCodificado = encodeURIComponent(nombreNormalizado);
                url = `${baseUrl}/justificantes/${empleadoId}/${archivoCodificado}`;

                // Fallback para nombres que ya venian codificados desde origen (ej. %20 o %2520).
                const archivoCodificadoAlterno = encodeURIComponent(nombreArchivo);
                const urlAlterna = `${baseUrl}/justificantes/${empleadoId}/${archivoCodificadoAlterno}`;
                urlsDeDescarga = urlAlterna !== url ? [url, urlAlterna] : [url];
            }

            // Evita mixed content cuando el front corre en HTTPS y el backend devuelve URL HTTP.
            if (esUrlAbsoluta) {
                const parsedUrl = new URL(archivoRef);
                const frontEnHttps = window.location.protocol === 'https:';
                const backendEnHttp = parsedUrl.protocol === 'http:';

                if (frontEnHttps && backendEnHttp) {
                    // Si es ruta de API, preferimos usarla relativa para pasar por el mismo origen/proxy.
                    if (parsedUrl.pathname.startsWith('/api/')) {
                        url = `${parsedUrl.pathname}${parsedUrl.search}`;
                    } else {
                        url = archivoRef.replace(/^http:/i, 'https:');
                    }
                    urlsDeDescarga = [url];
                }
            }
            
            const token = localStorage.getItem('usuario'); 
            if (!token) {
                throw new Error('Tu sesion ha expirado. Vuelve a iniciar sesion.');
            }

            // Usamos fetch nativo porque necesitamos manejar la respuesta como un Blob (archivo binario)
            let respuesta = null;
            for (let i = 0; i < urlsDeDescarga.length; i++) {
                const urlCandidata = urlsDeDescarga[i];
                respuesta = await fetch(urlCandidata, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'ngrok-skip-browser-warning': 'true'
                    }
                });

                if (respuesta.ok) {
                    break;
                }

                const esUltimoIntento = i === urlsDeDescarga.length - 1;
                const debeReintentar = respuesta.status === 403 || respuesta.status === 404;
                if (esUltimoIntento || !debeReintentar) {
                    break;
                }
            }

            if (!respuesta.ok) {
                throw new Error(`Error HTTP del servidor: ${respuesta.status}`);
            }

            // Convertimos la respuesta a binario (Blob)
            const blob = await respuesta.blob();
            // Creamos una URL local temporal en el navegador para ese binario
            const urlTemporal = URL.createObjectURL(blob);
            // Abrimos el archivo en una nueva pestaña (o forzamos descarga según la configuración del navegador)
            window.open(urlTemporal, '_blank');

            // Limpieza: Revocamos la URL temporal después de 10 segundos para liberar memoria
            setTimeout(() => {
                URL.revokeObjectURL(urlTemporal);
            }, 10000);

        } catch (error) {
            console.error("Error al descargar el archivo:", error);
            throw error;
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