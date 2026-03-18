export function Button({ children, type = "button", onClick, disabled = false, className = "", fullWidth = true }) {
    return (
    <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`
        px-4 py-2.5 rounded-lg font-medium text-white transition-all duration-200 flex items-center justify-center
        ${fullWidth ? "w-full" : "w-auto"}
        ${disabled 
            ? "bg-gray-400 cursor-not-allowed" 
            : "bg-[#0F2C59] hover:bg-[#163b75] active:scale-[0.98] shadow-md hover:shadow-lg"
        }
        ${className}
        `}
    >
        {children}
    </button>
    ) ;
}