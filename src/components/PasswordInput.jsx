import { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react'; // Íconos para el "ojito"

export const PasswordInput = forwardRef(({ label, placeholder, error, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
    <div className="flex flex-col gap-1 w-full mb-4 relative">
        {label && 
        <label className="block mb-2 font-medium text-gray-700">
            {label}
        </label>
        }

        <div className="relative">
        <input
            ref={ref}
            type={showPassword ? "text" : "password"}
            placeholder={placeholder}
            className={`w-full px-4 py-3 pr-12 border rounded-lg outline-none transition-all duration-200 
            ${error 
                ? "border-red-500 focus:ring-2 focus:ring-red-200" 
                : "border-gray-300 focus:border-[#0F2C59] focus:ring-2 focus:ring-blue-100" 
            }
            `}
            {...props}
        />
        <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0F2C59] transition-colors"
        >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
        </div>

        {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';