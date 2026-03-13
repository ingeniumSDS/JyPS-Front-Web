export function Card({ children, className = "" }) {
    return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 ${className}`}>
        {children}
    </div>
    );
}