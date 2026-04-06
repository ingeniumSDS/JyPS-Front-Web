import { Loader2 } from 'lucide-react';
import { Modal } from '../../components/Modal';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';

export default function DepartamentoFormModal({
    isOpen,
    onClose,
    onSubmit,
    isSaving,
    departamentoAEditar,
    formData,
    setFormData,
    jefesDisponibles
}) {
    return (
        <Modal 
            isOpen={isOpen} 
            onClose={() => !isSaving && onClose()}
            title={departamentoAEditar ? "Editar Departamento" : "Crear Nuevo Departamento"}
        >
            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del departamento*</label>
                    <Input 
                        value={formData.nombre}
                        onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                        placeholder="Ej. Recursos Humanos"
                        required
                        disabled={isSaving}
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción*</label>
                    <textarea 
                        value={formData.descripcion}
                        onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#0F2C59] focus:ring-1 focus:ring-[#0F2C59] min-h-[100px] resize-none disabled:bg-gray-100 disabled:text-gray-400"
                        placeholder="Funciones del departamento..."
                        required
                        disabled={isSaving} 
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Jefe del departamento (Opcional)
                    </label>
                    <select
                        value={formData.jefeId || ""} 
                        onChange={(e) => setFormData({...formData, jefeId: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#0F2C59] focus:ring-1 focus:ring-[#0F2C59] disabled:bg-gray-100 disabled:text-gray-400 bg-white"
                        disabled={isSaving}
                    >
                        <option value="">Sin jefe asignado</option>
                        {jefesDisponibles.map((jefe) => (
                            <option key={jefe.id} value={jefe.id}>
                                {jefe.nombreCompleto} 
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex gap-3 justify-end pt-4 mt-6 border-t border-gray-100">
                    <Button 
                        type="button" 
                        variant="outline" 
                        onClick={onClose}
                        disabled={isSaving}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        type="submit" 
                        className="bg-[#0F2C59] hover:bg-[#0a1f3d] text-white flex items-center gap-2"
                        disabled={isSaving}
                    >
                        {isSaving && <Loader2 size={16} className="animate-spin" />}
                        {isSaving 
                            ? 'Guardando...' 
                            : (departamentoAEditar ? 'Guardar Cambios' : 'Crear Departamento')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}