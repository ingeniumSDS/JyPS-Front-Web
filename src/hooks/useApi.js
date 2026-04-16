import { useState, useCallback } from 'react';

// Fallback de seguridad
const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/$/, '');

export const useApi = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(async (endpoint, method = 'GET', body = null) => {
        setIsLoading(true);
        setError(null);

        try {
            //  Detectar archivo/FormData
            const isFormData = body instanceof FormData;

            const headers = {
                'ngrok-skip-browser-warning': 'true'
            };

            // archivo/FormData
            if (!isFormData) {
                headers['Content-Type'] = 'application/json';
            }

            // Guardamos token
            const token = localStorage.getItem('usuario');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const config = { method, headers };

            // Preparacion del cuerpo
            if (body) {
                config.body = isFormData ? body : JSON.stringify(body);
            }

            const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
            const response = await fetch(`${BASE_URL}${normalizedEndpoint}`, config);
            
            // Nuestra solución anti-errores 201
            const text = await response.text();
            
            let data = {};
            if (text) {
                try {
                    data = JSON.parse(text);
                } catch (e) {
                    data = { mensaje: text };
                }
            }

            if (!response.ok) {
                throw new Error(data.mensaje);
            }

            return data;
            
        } catch (err) {
            setError(err.mensaje);
            throw err; 
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { request, isLoading, error };
};