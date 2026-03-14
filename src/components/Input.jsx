import { forwardRef } from 'react';
export const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
    return (
    <div className="w-full">
        {label && (
        <label className="block mb-2 font-medium text-gray-700">
            {label}
        </label>
        )}
        
        <input
        ref={ref}
        className={`w-full px-4 py-3 border rounded-lg transition-colors duration-200 outline-none
            ${error 
            ? 'border-[#DC3545] focus:border-[#DC3545] focus:ring-2 focus:ring-red-100' 
            : 'border-gray-300 focus:border-[#0F2C59] focus:ring-2 focus:ring-blue-100'
            }
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${className}`}
        {...props}
        />
        {error && (
        <p className="mt-1 text-sm text-[#DC3545]">{error}</p>
        )}
    </div>
    );
});

Input.displayName = 'Input';