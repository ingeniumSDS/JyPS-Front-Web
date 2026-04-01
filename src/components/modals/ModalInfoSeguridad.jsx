import { Modal } from '../Modal';

export const ModalInfoSeguridad = ({ isOpen, onClose }) => {
    return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Información de Seguridad"
    >
      <div className="space-y-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
          <h4 className="font-bold text-red-800 mb-2 flex items-center gap-2">
            ⚠️ Advertencia Importante
          </h4>
          <p className="text-sm text-red-700">
            Este sistema NO está diseñado ni autorizado para almacenar información personal identificable (PII) sensible o datos confidenciales de alto riesgo.
          </p>
        </div>

        <section>
          <h3 className="font-bold text-[#0F2C59] text-sm">❌ NO incluya en sus solicitudes:</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1 mt-2 text-sm pl-2">
            <li>Diagnósticos médicos detallados o condiciones de salud sensibles</li>
            <li>Información financiera (números de cuenta, tarjetas, salarios)</li>
            <li>Documentos oficiales con datos personales (INE, CURP completo, RFC)</li>
            <li>Información de terceros sin su consentimiento</li>
            <li>Datos de menores de edad sin autorización parental</li>
          </ul>
        </section>

        <section>
          <h3 className="font-bold text-[#0F2C59] text-sm">✅ Recomendaciones de Uso:</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1 mt-2 text-sm pl-2">
            <li>Use descripciones generales para justificantes ("Cita médica", "Trámite personal")</li>
            <li>No comparte su sesión activa con otras personas</li>
            <li>Cierre sesión al terminar de usar el sistema en dispositivos compartidos</li>
            <li>Reporte cualquier irregularidad al administrador del sistema</li>
          </ul>
        </section>

        <section>
          <h3 className="font-bold text-[#0F2C59] text-sm">🔒 Medidas de Seguridad Actuales:</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1 mt-2 text-sm pl-2">
            <li>Almacenamiento local cifrado en el navegador</li>
            <li>Validación de cuentas activas/inactivas</li>
            <li>Control de acceso basado en roles</li>
            <li>Protección de rutas por autenticación</li>
          </ul>
        </section>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
          <p className="text-sm text-blue-800">
            <strong>Nota:</strong> Este es un sistema de demostración educativo. Para un entorno de producción, se requieren medidas de seguridad adicionales como encriptación end-to-end, auditorías de seguridad y cumplimiento de estándares como ISO 27001.
          </p>
        </div>
      </div>
    </Modal>
  );
};