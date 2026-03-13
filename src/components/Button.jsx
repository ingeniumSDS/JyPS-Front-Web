// src/components/Button.jsx
export function Button({ children, type = "button", onClick, disabled = false }) {
    return (
    <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`
        w-full px-4 py-3 rounded-lg font-bold text-white transition-all duration-200
        ${disabled 
            ? "bg-gray-400 cursor-not-allowed" 
            : "bg-[#0F2C59] hover:bg-[#163b75] active:scale-[0.98] shadow-md hover:shadow-lg"
        }
        `}
    >
        {/* "children" es el texto que le pongamos adentro, ej: "Iniciar Sesión" */}
        {children}
    </button>
  ) ;
}