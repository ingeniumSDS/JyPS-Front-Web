import React from 'react';
import { CheckCircle, Download, Share2 } from 'lucide-react';
import QRCode from 'react-qr-code';
import {Modal} from '../../components/Modal'; 
import { Button } from '../../components/Button'; 

export default function QrModal({ isOpen, onClose, solicitud }) {
    //Funcion para descargar el QR encapsulada
    const handleDownloadQR = () => {
    const svg = document.getElementById("qr-code-svg");
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `Pase_${solicitud?.codigoQR || 'Salida'}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
 };

    const handleShareQR = () => {
    if (navigator.share && solicitud) {
        navigator.share({
        title: 'Mi Pase de Salida',
        text: `Código de Pase: ${solicitud.codigoQR}`,
        }).catch(console.error);
    }
    };

    if (!solicitud) return null;

    return (
    <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Código QR - Pase de Salida"
    >
        <div className="text-center">
        {/* QR Code */}
        <div className="inline-block p-6 bg-white border-4 border-[#0F2C59] rounded-2xl shadow-lg mb-6">
            <QRCode 
            id="qr-code-svg"
            value={solicitud.codigoQR || "sin-codigo"} 
            size={220}
            level="H"
            />
        </div>

        {/* Código */}
        <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">Código de Pase</p>
            <p className="text-3xl font-bold text-[#0F2C59] tracking-wider font-mono">
            {solicitud.codigoQR}
            </p>
        </div>

        {/* Estado */}
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-100 text-green-800 rounded-full mb-6">
            <CheckCircle size={20} />
            <span className="font-medium">Aprobado - Listo para usar</span>
        </div>

        {/* Detalles */}
        <div className="text-left bg-gray-50 p-4 rounded-lg mb-6 space-y-2">
            <div className="flex justify-between text-sm">
            <span className="text-gray-600">Fecha:</span>
            <span className="font-medium">
                {new Date(solicitud.fecha).toLocaleDateString('es-MX')}
            </span>
            </div>
            {solicitud.horaSalida && (
            <div className="flex justify-between text-sm">
                <span className="text-gray-600">Hora de salida:</span>
                <span className="font-medium">{solicitud.horaSalida}</span>
            </div>
            )}
            <div className="flex justify-between text-sm">
            <span className="text-gray-600">Motivo:</span>
            <span className="font-medium text-right flex-1 ml-4">
                {solicitud.motivo}
            </span>
            </div>
        </div>

        {/* Instrucciones */}
        <div className="text-left bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
            <p className="text-sm text-blue-800">
            <strong>📱 Instrucciones:</strong>
            <br />
            Presenta este código QR al personal de seguridad al salir de las instalaciones.
            </p>
        </div>

        {/* Botones de accion usando tu componente Button */}
        <div className="flex flex-col md:flex-row gap-3 mb-4">
            <Button
            variant="outline"
            fullWidth
            onClick={handleDownloadQR}
            className="flex items-center justify-center gap-2"
            >
            <Download size={18} />
            Descargar QR
            </Button>

            {navigator.share && (
            <Button
                variant="outline"
                fullWidth
                onClick={handleShareQR}
                className="flex items-center justify-center gap-2"
            >
                <Share2 size={18} />
                    Compartir
                </Button>
            )}
        </div>

        {/* Botón cerrar */}
        <Button
            fullWidth
            onClick={onClose}
        >
            Cerrar
        </Button>
        </div>
    </Modal>
  );
}