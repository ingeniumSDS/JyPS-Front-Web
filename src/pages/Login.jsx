import { useState } from "react";
import { Input } from "../components/Input";
import { PasswordInput } from "../components/PasswordInput";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { GraduationCap, Shield, Info, AlertTriangle } from "lucide-react";

export default function Login() {
  // Estados básicos para el formulario
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

  // Función que maneja el clic en "Iniciar Sesión"
    const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Validaciones
    if (!email || !password) {
        setError("Por favor, completa todos los campos.");
        return;
    }
    if (!email.endsWith("@utez.edu.mx")) {
        setError("Debes usar tu correo institucional (@utez.edu.mx).");
        return;
    }

    // Simulamos que está cargando
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
        alert("¡Validación exitosa! (Aquí conectaremos con el Backend después)");
        console.log("Datos listos para Spring Boot:", { email, password });
    }, 1500);
    };

    return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
        
        {/* Encabezado y Logo */}
        <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-[#0F2C59] rounded-full mb-3 sm:mb-4 shadow-lg">
            <GraduationCap size={28} className="text-white sm:w-8 sm:h-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F2C59] mb-2">
            Sistema JyPS
            </h1>
            <p className="text-sm sm:text-base text-gray-600 px-4">
            Sistema de Justificantes y Pases de Salida
            </p>
        </div>

        {/* Tarjeta Principal del Formulario */}
        <Card className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
            
            <Input
                type="email"
                label="Correo Electrónico"
                placeholder="tu.nombre@utez.edu.mx"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput
                label="Contraseña"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            {/* Mensaje de Error (si existe) */}
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <AlertTriangle size={16} className="text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            <div className="text-center">
                <a href="#recuperar" className="text-sm text-[#0F2C59] hover:underline font-medium">
                ¿Olvidaste tu contraseña?
                </a>
            </div>

            <Button type="submit" disabled={loading}>
                {loading ? "Ingresando..." : "Ingresar"}
            </Button>
            </form>
            
            <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
                ¿No tienes cuenta?{" "}
                <br></br>
                Comunícate con el administrador del sistema.
            </p>
            </div>
        </Card>

        {/* Tarjeta de Usuarios de Prueba (Opcional, muy útil para desarrollo) *
        <Card className="mt-4 p-3 sm:p-4 bg-gray-50 border-dashed">
            <p className="text-xs text-gray-600 mb-2 font-semibold">
            Datos de prueba sugeridos:
            </p>
            <div className="space-y-1 text-xs text-gray-500">
            <p>• Trabajador: juan@utez.edu.mx</p>
            <p>• Jefe: roberto@utez.edu.mx</p>
            <p className="mt-2 italic">Contraseña: cualquiera</p>
            </div>
        </Card> */}

        {/* Avisos Legales y Seguridad */}
        <div className="mt-4 space-y-3">
            <Card className="p-3 sm:p-4 bg-amber-50 border border-amber-200">
            <div className="flex items-start gap-2 sm:gap-3">
                <Shield className="text-amber-600 flex-shrink-0 mt-0.5 w-5 h-5" />
                <div>
                <p className="text-xs text-amber-800">
                    <strong>Aviso de Seguridad:</strong> Este sistema NO está diseñado para recopilar información personal identificable (PII) sensible ni datos confidenciales. No ingrese información médica detallada, datos financieros o información altamente sensible.
                </p>
                <button
                    className="text-xs text-amber-700 underline hover:text-amber-900 break-words"
                >
                Ver más información de seguridad
                </button>
                </div>
            </div>
            </Card>

            <Card className="p-3 sm:p-4 bg-blue-50 border border-blue-200">
            <div className="flex items-start gap-2 sm:gap-3">
                <Info className="text-blue-600 flex-shrink-0 mt-0.5 w-5 h-5" />
                <div>
                <p className="text-xs text-blue-800">
                    Al iniciar sesión, aceptas el uso de cookies estrictamente necesarias para mantener tu sesión activa.
                </p>
                <button
                    className="text-xs text-blue-700 underline hover:text-blue-900 break-words"
                >
                    Ver Aviso de Privacidad completo
                </button>
                </div>
            </div>
            </Card>
        </div>

        {/* Pie de página */}
        <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
            © 2026 UTEZ. Sistema JyPS v1.0.0
            </p>
        </div>

        </div>
    </div>
  );
}