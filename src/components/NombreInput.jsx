import React from 'react';

export const NombreInput = ({ 
    value, 
    onChange, 
    className = '', 
    ...props 
}) => {

    const handleChange = (e) => {
    let inputValue = e.target.value;

    // Elimina cualquier número o símbolo.
    inputValue = inputValue.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');

    //Autocapitalizar: primera mayuscula y el resto a minúscula.
    const palabras = inputValue.split(' ');
    const valorFormateado = palabras.map(palabra => {
        if (palabra.length > 0) {
            return palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase();
        }
        return '';
    }).join(' ');

    // 3. Mutamos el valor del evento para pasárselo al componente padre
    e.target.value = valorFormateado;

    // 4. Ejecutamos la función onChange original (si existe)
    if (onChange) {
        onChange(e);
    }
};

    return (
        <input
            value={value}
            onChange={handleChange}
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg transition-colors duration-200 outline-none bg-white focus:border-[#0F2C59] focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
            {...props}
        />
    );
};

export default NombreInput; 