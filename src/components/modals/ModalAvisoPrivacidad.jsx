import { Modal } from '../Modal';

export const ModalAvisoPrivacidad = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Aviso de Privacidad"
      size="lg"
    >
      <div className="space-y-4">
        <section>
          <h3 className="font-bold text-[#0F2C59] text-sm">1. Responsable del Tratamiento de Datos</h3>
          <p className="text-gray-700 text-sm mt-1">
            La Universidad Tecnológica Emiliano Zapata del Estado de Morelos (UTEZ), con domicilio en Av. Universidad Tecnológica No. 1, Col. Palo Escrito, Emiliano Zapata, Morelos, es responsable del tratamiento de sus datos personales.
          </p>
        </section>

        <section>
          <h3 className="font-bold text-[#0F2C59] text-sm">2. Datos Recopilados</h3>
          <p className="text-gray-700 text-sm mt-1">El sistema recopila únicamente:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-1 mt-1 text-sm pl-2">
            <li>Nombre completo</li>
            <li>Correo electrónico institucional</li>
            <li>Número de teléfono</li>
            <li>Rol en la institución</li>
            <li>Información sobre solicitudes de pases y justificantes</li>
          </ul>
        </section>

        <section>
          <h3 className="font-bold text-[#0F2C59] text-sm">3. Finalidad del Tratamiento</h3>
          <p className="text-gray-700 text-sm mt-1">Sus datos serán utilizados exclusivamente para:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-1 mt-1 text-sm pl-2">
            <li>Gestionar solicitudes de pases de salida</li>
            <li>Gestionar justificantes de ausencia</li>
            <li>Control de acceso y seguridad institucional</li>
            <li>Reportes estadísticos internos</li>
          </ul>
        </section>

        <section>
          <h3 className="font-bold text-[#0F2C59] text-sm">4. Almacenamiento y Seguridad</h3>
          <p className="text-gray-700 text-sm mt-1">
            Los datos se almacenan localmente en su navegador mediante tecnología localStorage. Es su responsabilidad no compartir dispositivos con acceso a su sesión activa.
          </p>
        </section>

        <section>
          <h3 className="font-bold text-[#0F2C59] text-sm">5. Derechos ARCO</h3>
          <p className="text-gray-700 text-sm mt-1">
            Usted tiene derecho a Acceder, Rectificar, Cancelar u Oponerse al tratamiento de sus datos personales, conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP).
          </p>
        </section>

        <section>
          <h3 className="font-bold text-[#0F2C59] text-sm">6. Contacto</h3>
          <p className="text-gray-700 text-sm mt-1">
            Para ejercer sus derechos ARCO o cualquier duda sobre el tratamiento de sus datos, contacte al administrador del sistema o al departamento de TI de la institución.
          </p>
        </section>

        <div className="pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 italic text-left">
            Última actualización: 11 de febrero de 2026
          </p>
        </div>
      </div>
    </Modal>
  );
};