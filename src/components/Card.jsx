export function Card({ children, className = "", onClick }) {
    return (
    <div 
    className={`bg-white rounded-lg shadow-lg border-gray-100  ${className}`}
    onClick={onClick}
    >
        {children}
    </div>
    );
}