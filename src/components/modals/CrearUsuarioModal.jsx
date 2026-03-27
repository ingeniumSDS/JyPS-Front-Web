import { useState, useEffect } from 'react';
import { X, UserPlus, Clock, Mail, Phone, Building2, Shield, Send, User, AlertCircle, Edit } from 'lucide-react';

const ROLES_DISPONIBLES = [
    { value: 'ADMINISTRADOR', label: 'Administrador' },
    { value: 'RECURSOS_HUMANOS', label: 'Recursos Humanos' },
    { value: 'JEFE_DEPARTAMENTO', label: 'Jefe de Departamento' },
    { value: 'EMPLEADO', label: 'Empleado' },
    { value: 'GUARDIA', label: 'Guardia de Seguridad' }
];

export function CrearUsuarioModal({ isOpen, onClose, onSubmit, departamentos = [], usuarioAEditar = null }) {
    const estadoInicial = {
        nombre: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        correo: "",
        telefono: "",
        horaEntrada: "08:00",
        horaSalida: "16:00",
        roles: [], 
        departamentoId: ""
    };

    const [formData, setFormData] = useState(estadoInicial);
    const [errores, setErrores] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [mostrarErrorGeneral, setMostrarErrorGeneral] = useState(false);

    //creamos o editamos
    useEffect(() => {
        if (isOpen) {
            if (usuarioAEditar) {
                const partesNombre = usuarioAEditar.nombreCompleto ? usuarioAEditar.nombreCompleto.split(' ') : [];
                // MODO EDITAR
                setFormData({
                    // Control de datos
                    nombre:partesNombre[0] || "",
                    apellidoPaterno: partesNombre[1] || "",
                    apellidoMaterno: partesNombre.slice(2).join(' ') || "",
                    correo: usuarioAEditar.email || "",
                    telefono: usuarioAEditar.telefono || "",
                    horaEntrada: usuarioAEditar.horaEntrada ? usuarioAEditar.horaEntrada.substring(0,5) : "08:00", 
                    horaSalida: usuarioAEditar.horaSalida ? usuarioAEditar.horaSalida.substring(0,5) : "16:00",
                    roles: usuarioAEditar.rolesOriginales || [usuarioAEditar.rol.toUpperCase()] || [],
                    departamentoId: usuarioAEditar.departamentoId || ""
                });
            } else {
                // MODO CREAR
                setFormData(estadoInicial);
            }
            
            setErrores({});
            setMostrarErrorGeneral(false);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen, usuarioAEditar]); 

    // REGLAS DE NEGOCIO 
    const hasRole = (role) => formData.roles.includes(role);
    const necesitaDepartamento = hasRole('EMPLEADO') || hasRole('ADMINISTRADOR') || hasRole('RECURSOS_HUMANOS') || hasRole('JEFE_DEPARTAMENTO');
    const necesitaHorario = necesitaDepartamento; 

    // VALIDACIONES EN TIEMPO REAL
    const validarCampo = (name, value) => {
        let error = null;

        switch (name) {
            case 'nombre':
            case 'apellidoPaterno':
            case 'apellidoMaterno':
                if (value.trim().length > 0 && value.trim().length < 3) {
                    error = "Debe tener al menos 3 letras";
                }
                break;
            case 'correo':
                if (value && !value.endsWith('@utez.edu.mx')) {
                    error = "Debe usar el dominio @utez.edu.mx";
                }
                break;
            case 'telefono':
                if (value && value.length !== 10) {
                    error = "Debe tener exactamente 10 dígitos";
                }
                break;
            default:
                break;
        }

        setErrores(prev => {
            const nuevosErrores = { ...prev };
            if (error) nuevosErrores[name] = error;
            else delete nuevosErrores[name];
            return nuevosErrores;
        });
    };

    // Validar horas
    useEffect(() => {
        if (formData.horaEntrada && formData.horaSalida) {
            setErrores(prev => {
                const nuevosErrores = { ...prev };
                if (formData.horaSalida <= formData.horaEntrada) {
                    nuevosErrores.horaSalida = "La salida debe ser posterior a la entrada";
                } else {
                    delete nuevosErrores.horaSalida;
                }
                return nuevosErrores;
            });
        }
    }, [formData.horaEntrada, formData.horaSalida]);

    // MANEJADORES DE EVENTOS
    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;
        
        if (['nombre', 'apellidoPaterno', 'apellidoMaterno'].includes(name)) {
            newValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ''); 
        } else if (name === 'telefono') {
            newValue = value.replace(/\D/g, ''); 
        }

        setFormData(prev => ({ ...prev, [name]: newValue }));
        validarCampo(name, newValue);
        
        if (name === 'departamentoId' && newValue) {
            setErrores(prev => {
                const nuevos = { ...prev };
                delete nuevos[name];
                return nuevos;
            });
        }
    };

    const toggleRole = (rolValue) => {
        setFormData(prev => {
            const rolesActuales = prev.roles;
            let nuevosRoles = rolesActuales.includes(rolValue) 
                ? rolesActuales.filter(r => r !== rolValue) 
                : [...rolesActuales, rolValue];
            
            return { ...prev, roles: nuevosRoles };
        });
        
        setErrores(prev => {
            const nuevos = { ...prev };
            delete nuevos.roles;
            return nuevos;
        });
    };

    // VALIDACIÓN FINAL
    const validarFormulario = () => {
        const nuevosErrores = { ...errores };
        let isValid = true;

        if (!formData.nombre.trim()) nuevosErrores.nombre = "Obligatorio";
        if (!formData.apellidoPaterno.trim()) nuevosErrores.apellidoPaterno = "Obligatorio";
        if (!formData.apellidoMaterno.trim()) nuevosErrores.apellidoMaterno = "Obligatorio";
        if (!formData.correo.trim()) nuevosErrores.correo = "Obligatorio";
        if (!formData.telefono || formData.telefono.length !== 10) nuevosErrores.telefono = "Faltan dígitos";
        if (formData.roles.length === 0) nuevosErrores.roles = "Seleccione al menos un rol";

        if (necesitaDepartamento && !formData.departamentoId) {
            nuevosErrores.departamentoId = "Seleccione un departamento";
        }

        if (Object.keys(nuevosErrores).length > 0) {
            isValid = false;
            setErrores(nuevosErrores);
            setMostrarErrorGeneral(true);
            const modalContent = document.getElementById('modal-scroll-container');
            if (modalContent) modalContent.scrollTop = 0;
        } else {
            setMostrarErrorGeneral(false);
        }

        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validarFormulario()) return;

        setIsLoading(true);
        try {
            await onSubmit(formData, usuarioAEditar?.id); 
        } catch (error) {
            console.error("Error al procesar el formulario", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const tieneErrores = Object.keys(errores).length > 0;
    
    const esModoEditar = usuarioAEditar !== null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden relative">
                
                {/* CABECERA DINÁMICA */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-2 text-[#0F2C59]">
                        {esModoEditar ? <Edit size={24} /> : <UserPlus size={24} />}
                        <h2 className="text-xl font-bold">
                            {esModoEditar ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
                        </h2>
                    </div>
                    <button onClick={onClose} disabled={isLoading} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                        <X size={20} />
                    </button>
                </div>

                <div id="modal-scroll-container" className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-gray-50/30">
                    <form id="crear-usuario-form" onSubmit={handleSubmit} className="space-y-6">
                        
                        {mostrarErrorGeneral && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-center gap-2 animate-in slide-in-from-top-2">
                                <AlertCircle size={18} className="flex-shrink-0" />
                                <p>Revisa las alertas en rojo antes de continuar.</p>
                            </div>
                        )}

                        {/* Datos Personales */}
                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-gray-100">
                                <User size={16} className="text-[#0F2C59]"/> Datos Personales
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                                    <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} disabled={isLoading} className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${errores.nombre ? 'border-red-400 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:border-[#0F2C59] focus:ring-2 focus:ring-[#0F2C59]/20'}`} />
                                    {errores.nombre && <p className="text-xs text-red-500 mt-1">{errores.nombre}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Apellido Paterno *</label>
                                    <input type="text" name="apellidoPaterno" value={formData.apellidoPaterno} onChange={handleChange} disabled={isLoading} className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${errores.apellidoPaterno ? 'border-red-400 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:border-[#0F2C59] focus:ring-2 focus:ring-[#0F2C59]/20'}`} />
                                    {errores.apellidoPaterno && <p className="text-xs text-red-500 mt-1">{errores.apellidoPaterno}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Apellido Materno *</label>
                                    <input type="text" name="apellidoMaterno" value={formData.apellidoMaterno} onChange={handleChange} disabled={isLoading} className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${errores.apellidoMaterno ? 'border-red-400 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:border-[#0F2C59] focus:ring-2 focus:ring-[#0F2C59]/20'}`} />
                                    {errores.apellidoMaterno && <p className="text-xs text-red-500 mt-1">{errores.apellidoMaterno}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                                    <input type="tel" name="telefono" maxLength="10" value={formData.telefono} onChange={handleChange} disabled={isLoading} className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${errores.telefono ? 'border-red-400 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:border-[#0F2C59] focus:ring-2 focus:ring-[#0F2C59]/20'}`} />
                                    {errores.telefono && <p className="text-xs text-red-500 mt-1">{errores.telefono}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                    <input type="email" name="correo" value={formData.correo} onChange={handleChange} disabled={isLoading} className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${errores.correo ? 'border-red-400 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:border-[#0F2C59] focus:ring-2 focus:ring-[#0F2C59]/20'}`} />
                                    {errores.correo && <p className="text-xs text-red-500 mt-1">{errores.correo}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Sistema */}
                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-gray-100">
                                <Shield size={16} className="text-[#0F2C59]"/> Roles y Asignaciones
                            </h3>

                            {/* ROLES CHECKBOXES */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Roles * (Seleccione uno o más)</label>
                                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 p-4 border rounded-lg bg-gray-50/50 ${errores.roles ? 'border-red-400 bg-red-50/30' : 'border-gray-200'}`}>
                                    {ROLES_DISPONIBLES.map(opcion => (
                                        <label key={opcion.value} className="flex items-center gap-3 p-2 rounded hover:bg-white cursor-pointer">
                                            <input type="checkbox" checked={formData.roles.includes(opcion.value)} onChange={() => toggleRole(opcion.value)} disabled={isLoading} className="w-4 h-4 text-[#0F2C59] rounded border-gray-300 focus:ring-[#0F2C59]" />
                                            <span className="text-sm text-gray-700">{opcion.label}</span>
                                        </label>
                                    ))}
                                </div>
                                {errores.roles && <p className="text-xs text-red-500 mt-1">{errores.roles}</p>}
                            </div>

                            {/* DEPARTAMENTO*/}
                            {necesitaDepartamento && (
                                <div className="mt-4 animate-in fade-in duration-300">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <Building2 size={16} className="inline mr-1 text-gray-500"/> Departamento *
                                    </label>
                                    <select name="departamentoId" value={formData.departamentoId} onChange={handleChange} disabled={isLoading} className={`w-full px-4 py-2 border rounded-lg bg-white outline-none transition-all ${errores.departamentoId ? 'border-red-400 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:border-[#0F2C59] focus:ring-2 focus:ring-[#0F2C59]/20'}`}>
                                        <option value="">Seleccione un departamento...</option>
                                        {departamentos.map(depto => (
                                            <option key={depto.id} value={depto.id}>{depto.nombre}</option>
                                        ))}
                                    </select>
                                    {errores.departamentoId && <p className="text-xs text-red-500 mt-1">{errores.departamentoId}</p>}
                                </div>
                            )}

                            {/* HORARIOS */}
                            {necesitaHorario && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 animate-in fade-in duration-300">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Hora Inicio Jornada *</label>
                                        <input type="time" name="horaEntrada" value={formData.horaEntrada} onChange={handleChange} disabled={isLoading} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F2C59] outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Hora Fin Jornada *</label>
                                        <input type="time" name="horaSalida" value={formData.horaSalida} onChange={handleChange} disabled={isLoading} className={`w-full px-4 py-2 border rounded-lg outline-none ${errores.horaSalida ? 'border-red-400 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:ring-[#0F2C59]'}`} />
                                        {errores.horaSalida && <p className="text-xs text-red-500 mt-1">{errores.horaSalida}</p>}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* AVISO DINÁMICO */}
                        {!esModoEditar && (
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <Send className="text-blue-600 mt-1" size={18} />
                                    <div>
                                        <h4 className="font-medium text-blue-900 mb-1">Contraseña Generada Automáticamente</h4>
                                        <p className="text-sm text-blue-700">Se enviará una contraseña al correo institucional.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                {/* BOTONES DINÁMICOS */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-white">
                    <button type="button" onClick={onClose} disabled={isLoading} className="px-6 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg">
                        Cancelar
                    </button>
                    <button type="submit" form="crear-usuario-form" disabled={isLoading || tieneErrores} className="px-6 py-2.5 text-sm font-medium text-white bg-[#0F2C59] hover:bg-[#0F2C59]/90 disabled:bg-gray-400 rounded-lg">
                        {isLoading ? 'Procesando...' : (esModoEditar ? 'Guardar Cambios' : 'Crear Usuario')}
                    </button>
                </div>
            </div>
        </div>
    );
}