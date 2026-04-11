import { useState, useCallback } from 'react';

// Fallback de seguridad
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ced-service.porgy-diatonic.ts.net:10000/api/v1';

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

            const response = await fetch(`${BASE_URL}${endpoint}`, config);
            
            // Nuestra solución anti-errores 201
            const text = await response.text();
            
            let data = {};
            if (text) {
                try {
                    data = JSON.parse(text);
                } catch (e) {
                    data = { message: text };
                }
            }

            if (!response.ok) {
                throw new Error(data.message || data.error || `Error HTTP: ${response.status}`);
            }

            return data;
            
        } catch (err) {
            setError(err.message);
            throw err; 
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { request, isLoading, error };
};