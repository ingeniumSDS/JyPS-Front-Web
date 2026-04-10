import { useApi } from './useApi';

export const useIncidencias = () => {
    const { request, isLoading, error } = useApi();

        const crearPaseSalida = async (datosPase, archivos) => {
        try {
            const formData = new FormData();

            // datos en formato JSON 
            formData.append('data', new Blob([JSON.stringify(datosPase)], {
                type: 'application/json'
            }));

            // archivos uno por uno
            if (archivos && archivos.length > 0) {
                archivos.forEach((archivo) => {
                    formData.append('archivos', archivo);
                });
            }else {
            
            }

            const resultado = await request('/pases', 'POST', formData);
            
            return { exito: true, data: resultado };
        } catch (error) {
            console.error("Error en crearPaseSalida:", error);
            return { exito: false, mensaje: error.message };
        }
    };

    return {
        crearPaseSalida,
        isSavingPase: isLoading,
        errorPase: error
    };
};