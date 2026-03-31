import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { KeyRound, CheckCircle, XCircle, User, Calendar, Clock, ArrowRightLeft } from 'lucide-react';

// funcion para hora en curso.
const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
};

// Mock temporal 
const MOCK_SOLICITUDES = [
    {
        codigoQR: 'GDKF64NC',
        estado: 'aprobado', 
        fecha: new Date().toISOString(),
        trabajador: { nombre: 'Juan Pérez García', email: 'juan.perez@utez.edu.mx' }
    },
    {
        codigoQR: 'REGRESO123',
        estado: 'en_curso',
        fecha: new Date().toISOString(),
        horaSalida: '10:00', 
        trabajador: { nombre: 'María Elena Sánchez', email: 'maria.sanchez@utez.edu.mx' }
    }
];

export default function ValidadorCodigo() {
    const [manualCode, setManualCode] = useState('');
    const [scannedData, setScannedData] = useState(null);
    const [isReturning, setIsReturning] = useState('si'); 

    const handleManualSubmit = (e) => {
        e.preventDefault();
        const solicitudOriginal = MOCK_SOLICITUDES.find(s => s.codigoQR === manualCode.toUpperCase());
        
        if (solicitudOriginal) {
            // solicitud para inyectarle la hora actual según su estado
            let solicitudProcesada = { ...solicitudOriginal };
            if (solicitudProcesada.estado === 'aprobado') {
                // hora actual-hora de salida
                solicitudProcesada.horaSalida = getCurrentTime();
            } else if (solicitudProcesada.estado === 'en_curso') {
                // hora actual- hora de regreso
                solicitudProcesada.horaRegreso = getCurrentTime();
            }

            setScannedData(solicitudProcesada);
        } else {
            alert('Código no válido. Verifique e intente nuevamente.');
            setScannedData(null);
        }
    };

    const handleRegistrarMovimiento = () => {
        if (!scannedData) return;

        if (scannedData.estado === 'aprobado') {
            alert(`Salida registrada a las ${scannedData.horaSalida}.\n¿El empleado regresa?: ${isReturning.toUpperCase()}`);
        } else if (scannedData.estado === 'en_curso') {
            alert(`Entrada registrada exitosamente a las ${scannedData.horaRegreso}.`);
        }

        setScannedData(null);
        setManualCode('');
        setIsReturning('si');
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">

            {/* Título */}
            <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#0F2C59] mb-2">Validación de Pases</h2>
                <p className="text-gray-600">Ingrese el código proporcionado por el trabajador</p>
            </div>

            {/* Formulario de Codigo */}
            <Card className="p-6">
                <form onSubmit={handleManualSubmit} className="space-y-6">
                    <div>
                        <label className="block mb-2 font-medium text-gray-700 text-center">Código de Autorización</label>
                        <div className="relative max-w-sm mx-auto">
                            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                            <Input
                                type="text"
                                placeholder="Ej: GDKF64NC"
                                value={manualCode}
                                onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                                className="pl-12 text-center text-2xl font-mono tracking-widest uppercase h-14"
                                required
                                autoComplete="off"
                            />
                        </div>
                    </div>

                    <div className="max-w-sm mx-auto">
                        <Button type="submit" fullWidth className="bg-[#0F2C59] hover:bg-[#0a1e3f] h-12 text-lg">
                            Verificar Código
                        </Button>
                    </div>
                </form>

                {/* EJEMPLOS */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg text-center border border-blue-100">
                    <p className="text-sm text-blue-800">
                        💡 <strong>Códigos de prueba:</strong><br />
                        <span className="font-mono bg-white px-2 py-1 rounded border border-blue-200 mx-1">GDKF64NC</span> (Para registrar salida) <br className="sm:hidden"/>
                        <span className="font-mono bg-white px-2 py-1 rounded border border-blue-200 mx-1">REGRESO123</span> (Para registrar entrada)
                    </p>
                </div>
            </Card>

            {/* Tarjeta de Resultados */}
            {scannedData && (
                <Card className={`p-6 border-2 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 ${
                    scannedData.estado !== 'completado' ? 'border-[#0F2C59]' : 'border-red-500'
                }`}>
                    {/* Cabecera del Estado */}
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                        {scannedData.estado !== 'completado' ? (
                            <CheckCircle className="text-[#28A745]" size={32} />
                        ) : (
                            <XCircle className="text-[#DC3545]" size={32} />
                        )}
                        <div>
                            <h3 className="font-bold text-xl text-gray-800">
                                {scannedData.estado === 'aprobado' ? 'Pase Válido para Salida' : 
                                    scannedData.estado === 'en_curso' ? 'Pase Válido para Entrada' : 'Pase Expirado / No Válido'}
                            </h3>
                            <p className="text-sm text-gray-500 font-mono">
                                {scannedData.codigoQR}
                            </p>
                        </div>
                    </div>

                    {/* Datos del Trabajador */}
                    <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 flex-shrink-0">
                                <User size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Trabajador</p>
                                <p className="font-bold text-gray-800 text-lg">{scannedData.trabajador.nombre}</p>
                                <p className="text-sm text-gray-600">{scannedData.trabajador.email}</p>
                            </div>
                        </div>

                        {/* contenedor dinamico para pantallas grandes */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            
                            {/* Fecha */}
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <Calendar className="text-gray-500" size={20} />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Fecha</p>
                                    <p className="font-medium text-gray-800">{new Date(scannedData.fecha).toLocaleDateString('es-MX')}</p>
                                </div>
                            </div>
                            
                            {/* Hora de Salida */}
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <Clock className="text-gray-500" size={20} />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Hora de Salida</p>
                                    <p className="font-medium text-gray-800">{scannedData.horaSalida}</p>
                                </div>
                            </div>

                            {/* Hora de Regreso */}
                            {scannedData.horaRegreso && (
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <Clock className="text-gray-500" size={20} />
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-semibold text-blue-600">Hora de Regreso</p>
                                        <p className="font-bold text-blue-800">{scannedData.horaRegreso}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Selector de Regreso */}
                        {scannedData.estado === 'aprobado' && (
                            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 mt-4">
                                <label className="flex items-center gap-2 font-semibold text-yellow-800 mb-3">
                                    <ArrowRightLeft size={18} />
                                    ¿El trabajador regresará a las instalaciones?
                                </label>
                                <select 
                                    value={isReturning}
                                    onChange={(e) => setIsReturning(e.target.value)}
                                    className="w-full p-3 border border-yellow-300 rounded-md bg-white text-gray-800 focus:ring-2 focus:ring-yellow-500 outline-none"
                                >
                                    <option value="si">SI</option>
                                    <option value="no">NO, termino de turno</option>
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Botones de Acción */}
                    {scannedData.estado === 'aprobado' && (
                        <Button
                            onClick={handleRegistrarMovimiento}
                            className="w-full bg-[#28A745] hover:bg-[#218838] h-14 text-lg font-bold"
                        >
                            Registrar Salida
                        </Button>
                    )}

                    {scannedData.estado === 'en_curso' && (
                        <Button
                            onClick={handleRegistrarMovimiento}
                            className="w-full bg-[#0F2C59] hover:bg-[#0a1e3f] h-14 text-lg font-bold"
                        >
                            Registrar Entrada de Regreso
                        </Button>
                    )}

                    {scannedData.estado === 'completado' && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                            <p className="font-semibold text-[#DC3545]">
                                Este pase ya cumplió su ciclo y no puede volver a usarse.
                            </p>
                        </div>
                    )}
                </Card>
            )}
        </div>
    );
}