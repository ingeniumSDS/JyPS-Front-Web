import { useState, useEffect } from 'react';
import { X, UserPlus, Clock, Mail, Phone, Building2, Shield, Send, User, AlertCircle, Edit, RotateCcw } from 'lucide-react';

// --- CONSTANTES GLOBALES ---
const ROLES_DISPONIBLES = [
    { value: 'ADMINISTRADOR', label: 'Administrador' },
    { value: 'AUDITOR', label: 'Auditor' },
    { value: 'JEFE_DE_DEPARTAMENTO', label: 'Jefe de Departamento' },
    { value: 'EMPLEADO', label: 'Empleado' },
    { value: 'GUARDIA', label: 'Guardia de Seguridad' }
];

const ESTADO_INICIAL = {
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

export function CrearUsuarioModal({ isOpen, onClose, onSubmit, departamentos = [], usuarioAEditar = null, onReset }) {
    // --- ESTADOS ---
    const [formData, setFormData] = useState(ESTADO_INICIAL);
    const [errores, setErrores] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [mostrarErrorGeneral, setMostrarErrorGeneral] = useState(false);

    // --- VARIABLES CALCULADAS ---
    const necesitaDepartamento = formData.roles.length > 0 && !formData.roles.includes('GUARDIA');
    const esModoEdicion = !!usuarioAEditar;
    const tieneErrores = Object.keys(errores).length > 0;

    // --- EFECTOS (CICLO DE VIDA) ---
    // Inicialización del formulario (Creación/Edición)
    useEffect(() => {
        if (isOpen) {
            if (usuarioAEditar) {
                const partesNombre = usuarioAEditar.nombreCompleto ? usuarioAEditar.nombreCompleto.split(' ') : [];
                
                // Extrae y normaliza el ID del departamento desde los datos del backend
                let idDeptoCorrecto = "";
                
                if (usuarioAEditar.departamentoId) {
                    idDeptoCorrecto = usuarioAEditar.departamentoId;
                } else if (usuarioAEditar.departamento) {
                    const soloNumero = String(usuarioAEditar.departamento).replace(/\D/g, '');
                    
                    if (soloNumero) {
                        idDeptoCorrecto = Number(soloNumero);
                    } else {
                        const deptoEncontrado = departamentos.find(d => 
                            d.nombre.toLowerCase() === String(usuarioAEditar.departamento).toLowerCase()
                        );
                        if (deptoEncontrado) {
                            idDeptoCorrecto = deptoEncontrado.id;
                        }
                    }
                }

                setFormData({
                    nombre: partesNombre[0] || "",
                    apellidoPaterno: partesNombre[1] || "",
                    apellidoMaterno: partesNombre.slice(2).join(' ') || "",
                    correo: usuarioAEditar.email || "",
                    telefono: usuarioAEditar.telefono || "",
                    horaEntrada: usuarioAEditar.horaEntrada ? usuarioAEditar.horaEntrada.substring(0,5) : "08:00", 
                    horaSalida: usuarioAEditar.horaSalida ? usuarioAEditar.horaSalida.substring(0,5) : "16:00",
                    roles: usuarioAEditar.rolesOriginales || (usuarioAEditar.rol ? [usuarioAEditar.rol.toUpperCase()] : []),
                    departamentoId: idDeptoCorrecto 
                });
            } else {
                setFormData(ESTADO_INICIAL);
            }
            
            setErrores({});
            setMostrarErrorGeneral(false);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen, usuarioAEditar, departamentos]); 

    // Validación en tiempo real del teléfono (solo numérico)
    useEffect(() => {
        if (formData.telefono && !/^\d*$/.test(formData.telefono)) {
            setFormData(prev => ({ ...prev, telefono: prev.telefono.replace(/\D/g, '') }));
        }
        if (formData.telefono.length > 10) {
            setFormData(prev => ({ ...prev, telefono: prev.telefono.slice(0, 10) }));
        }
    }, [formData.telefono]);

    // --- MANEJADORES DE EVENTOS ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Limpia el error del campo que se está editando
        if (errores[name]) {
            setErrores(prev => {
                const nuevosErrores = { ...prev };
                delete nuevosErrores[name];
                return nuevosErrores;
            });
        }
    };

    const handleRoleToggle = (roleValue) => {
        setFormData(prev => {
            const nuevosRoles = prev.roles.includes(roleValue)
                ? prev.roles.filter(r => r !== roleValue)
                : [...prev.roles, roleValue];
            
            const departamentoId = nuevosRoles.includes('GUARDIA') ? '' : prev.departamentoId;

            return { ...prev, roles: nuevosRoles, departamentoId };
        });

        if (errores.roles) {
            setErrores(prev => {
                const nuevosErrores = { ...prev };
                delete nuevosErrores.roles;
                return nuevosErrores;
            });
        }
    };

    // --- VALIDACIÓN Y ENVÍO ---
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
            const deptoSeguridad = departamentos.find(d => d.nombre.toLowerCase().trim() === 'seguridad');
            const esGuardia = formData.roles.includes('Guardia de Seguridad') || formData.roles.includes('GUARDIA');

            // Asigna de ID del departamento-Seguridad si el usuario es Guardia
            const datosAEnviar = {
                ...formData,
                departamentoId: (esGuardia && deptoSeguridad) ? deptoSeguridad.id : formData.departamentoId,
                horaEntrada: esGuardia ? "00:00" : formData.horaEntrada,
                horaSalida: esGuardia ? "23:59" : formData.horaSalida
            };

            await onSubmit(datosAEnviar, usuarioAEditar?.id); 
        } catch (error) {
            console.error("Error al procesar el formulario", error);
        } finally {
            setIsLoading(false);
        }
    };

    // --- RENDERIZADO ---
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                
                {/* HEADER */}
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-[#0F2C59] text-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg">
                            {esModoEdicion ? <Edit size={24} /> : <UserPlus size={24} />}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">{esModoEdicion ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h2>
                            <p className="text-white/70 text-sm">{esModoEdicion ? 'Modifica los datos del usuario' : 'Ingresa los datos para registrar un usuario'}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* ERROR GENERAL */}
                {mostrarErrorGeneral && (
                    <div className="mx-6 mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex items-start gap-3">
                        <AlertCircle className="text-red-500 mt-0.5" size={20} />
                        <div>
                            <h3 className="text-red-800 font-medium">Hay errores en el formulario</h3>
                            <p className="text-red-600 text-sm mt-1">Por favor, revisa los campos marcados en rojo antes de continuar.</p>
                        </div>
                    </div>
                )}

                {/* CUERPO DEL MODAL */}
                <div id="modal-scroll-container" className="flex-1 overflow-y-auto p-6 scroll-smooth">
                    <form id="crear-usuario-form" onSubmit={handleSubmit} className="space-y-8">
                        
                        {/* SECCIÓN: DATOS PERSONALES */}
                        <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-2 mb-6 text-[#0F2C59]">
                                <User size={20} />
                                <h3 className="text-lg font-semibold">Datos Personales</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Nombre *</label>
                                    <input 
                                        type="text" name="nombre" value={formData.nombre} onChange={handleChange} 
                                        className={`w-full px-4 py-2.5 rounded-lg border ${errores.nombre ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[#0F2C59]/20 focus:border-[#0F2C59] outline-none transition-all`} 
                                        placeholder="Ej. Juan" 
                                    />
                                    {errores.nombre && <p className="text-red-500 text-xs mt-1 font-medium">{errores.nombre}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Apellido Paterno *</label>
                                    <input 
                                        type="text" name="apellidoPaterno" value={formData.apellidoPaterno} onChange={handleChange} 
                                        className={`w-full px-4 py-2.5 rounded-lg border ${errores.apellidoPaterno ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[#0F2C59]/20 focus:border-[#0F2C59] outline-none transition-all`} 
                                        placeholder="Ej. Pérez" 
                                    />
                                    {errores.apellidoPaterno && <p className="text-red-500 text-xs mt-1 font-medium">{errores.apellidoPaterno}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Apellido Materno *</label>
                                    <input 
                                        type="text" name="apellidoMaterno" value={formData.apellidoMaterno} onChange={handleChange} 
                                        className={`w-full px-4 py-2.5 rounded-lg border ${errores.apellidoMaterno ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[#0F2C59]/20 focus:border-[#0F2C59] outline-none transition-all`} 
                                        placeholder="Ej. López" 
                                    />
                                    {errores.apellidoMaterno && <p className="text-red-500 text-xs mt-1 font-medium">{errores.apellidoMaterno}</p>}
                                </div>
                            </div>
                        </div>

                        {/* SECCIÓN: CONTACTO */}
                        <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-2 mb-6 text-[#0F2C59]">
                                <Mail size={20} />
                                <h3 className="text-lg font-semibold">Información de Contacto</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Email Institucional *</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input 
                                            type="email" name="correo" value={formData.correo} onChange={handleChange} 
                                            className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${errores.correo ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[#0F2C59]/20 focus:border-[#0F2C59] outline-none transition-all`} 
                                            placeholder="usuario@utez.edu.mx" 
                                        />
                                    </div>
                                    {errores.correo && <p className="text-red-500 text-xs mt-1 font-medium">{errores.correo}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Teléfono *</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input 
                                            type="tel" name="telefono" value={formData.telefono} onChange={handleChange} 
                                            maxLength="10" 
                                            className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${errores.telefono ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[#0F2C59]/20 focus:border-[#0F2C59] outline-none transition-all`} 
                                            placeholder="10 dígitos" 
                                        />
                                    </div>
                                    {errores.telefono && <p className="text-red-500 text-xs mt-1 font-medium">{errores.telefono}</p>}
                                </div>
                            </div>
                        </div>

                        {/* SECCIÓN: ROLES Y ASIGNACIONES */}
                        <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-2 mb-6 text-[#0F2C59]">
                                <Shield size={20} />
                                <h3 className="text-lg font-semibold">Roles y Asignaciones</h3>
                            </div>
                            
                            <div className="space-y-4 mb-6">
                                <label className="text-sm font-medium text-gray-700">Roles (Seleccione uno o más) *</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                    {ROLES_DISPONIBLES.map((role) => (
                                        <label key={role.value} className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${formData.roles.includes(role.value) ? 'border-[#0F2C59] bg-blue-50 ring-1 ring-[#0F2C59]' : 'border-gray-200 hover:border-[#0F2C59]/50 hover:bg-gray-50'}`}>
                                            <input 
                                                type="checkbox" checked={formData.roles.includes(role.value)} 
                                                onChange={() => handleRoleToggle(role.value)} 
                                                className="w-4 h-4 text-[#0F2C59] border-gray-300 rounded focus:ring-[#0F2C59]" 
                                            />
                                            <span className="ml-3 text-sm font-medium text-gray-700">{role.label}</span>
                                        </label>
                                    ))}
                                </div>
                                {errores.roles && <p className="text-red-500 text-xs mt-1 font-medium">{errores.roles}</p>}
                            </div>

                            {necesitaDepartamento && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-200">
                                    <div className="space-y-2 md:col-span-1">
                                        <label className="text-sm font-medium text-gray-700">Departamento *</label>
                                        <div className="relative">
                                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <select 
                                                name="departamentoId" value={formData.departamentoId} onChange={handleChange} 
                                                className={`w-full pl-10 pr-4 py-2.5 bg-white rounded-lg border ${errores.departamentoId ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[#0F2C59]/20 focus:border-[#0F2C59] outline-none transition-all appearance-none`}
                                            >
                                                <option value="">Seleccione un departamento...</option>
                                                {departamentos.map(depto => (
                                                    <option key={depto.id} value={depto.id}>{depto.nombre}</option>
                                                ))}
                                            </select>
                                        </div>
                                        {errores.departamentoId && <p className="text-red-500 text-xs mt-1 font-medium">{errores.departamentoId}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Hora Inicio Jornada *</label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input 
                                                type="time" name="horaEntrada" value={formData.horaEntrada} onChange={handleChange} 
                                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0F2C59]/20 focus:border-[#0F2C59] outline-none transition-all" 
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Hora Fin Jornada *</label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input 
                                                type="time" name="horaSalida" value={formData.horaSalida} onChange={handleChange} 
                                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0F2C59]/20 focus:border-[#0F2C59] outline-none transition-all" 
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* AVISO CONTRASEÑA */}
                        {!esModoEdicion && (
                            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg text-[#0F2C59]">
                                    <Send size={20} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-[#0F2C59]">Envío de Credenciales</h4>
                                    <p className="text-sm text-gray-600 mt-1">Al guardar, el sistema generará y enviará una contraseña al correo institucional.</p>
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                {/* BOTONES DINAMICOS Y DE RESETEO */}
                <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
                    
                    {/* BotOn Resetear */}
                    <div className="w-full sm:w-auto flex-shrink-0">
                        {esModoEdicion && usuarioAEditar?.id && (
                            <button
                                type="button"
                                onClick={() => onReset(usuarioAEditar.id)}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 text-red-600 border border-red-600 hover:bg-red-50 font-medium rounded-lg transition-colors"
                            >
                                <RotateCcw size={18} />
                                Resetear cuenta
                            </button>
                        )}
                    </div>

                        {/* Botones Cancelar y Guardar */}
                        <div className="flex flex-col-reverse sm:flex-row gap-3 w-full sm:w-auto">
                            <button 
                                type="button" 
                                onClick={onClose}
                                className="w-full sm:w-auto px-6 py-2.5 flex items-center justify-center text-sm font-medium text-[#0F2C59] border-2 border-[#0F2C59] hover:bg-[#0F2C59] hover:text-white rounded-lg transition-colors"
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit" form="crear-usuario-form" disabled={isLoading || tieneErrores} 
                                className="w-full sm:w-auto px-6 py-2.5 flex items-center justify-center min-w-[160px] text-sm font-medium text-white bg-[#0F2C59] hover:bg-[#0F2C59]/90 disabled:bg-gray-400 rounded-lg transition-colors"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Procesando...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        {esModoEdicion ? <Edit size={18} /> : <UserPlus size={18} />}
                                        {esModoEdicion ? 'Guardar Cambios' : 'Crear Usuario'}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
    );
}