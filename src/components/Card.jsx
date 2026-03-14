export function Card({ children, className = "" }) {
    return (
    <div className={`bg-white rounded-lg shadow-lg border  ${className}`}>
        {children}
    </div>
    );
}