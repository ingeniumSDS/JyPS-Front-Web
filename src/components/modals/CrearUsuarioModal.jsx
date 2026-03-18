import { useState, useEffect } from 'react';
import { X, UserPlus, Clock, Mail, Phone, Building2, Shield, Send, User, AlertCircle } from 'lucide-react';

const ROLES_DISPONIBLES = [
    { value: 'ADMINISTRADOR', label: 'Administrador' },
    { value: 'RECURSOS_HUMANOS', label: 'Recursos Humanos' },
    { value: 'JEFE_DEPARTAMENTO', label: 'Jefe de Departamento' },
    { value: 'EMPLEADO', label: 'Empleado' },
    { value: 'GUARDIA', label: 'Guardia de Seguridad' }
];

export function CrearUsuarioModal({ isOpen, onClose, onSubmit, departamentos, jefesActivos = [] }) {
    const estadoInicial = {
        nombre: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        correo: "",
        telefono: "",
        horaEntrada: "08:00",
        horaSalida: "16:00",
        roles: [], 
        departamentoId: "",
        jefeId: ""
    };

    const [formData, setFormData] = useState(estadoInicial);
    const [errores, setErrores] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [mostrarErrorGeneral, setMostrarErrorGeneral] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFormData(estadoInicial);
            setErrores({});
            setMostrarErrorGeneral(false);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    //REGLAS DE NEGOCIO POR ROLES
    const hasRole = (role) => formData.roles.includes(role);
    //Guardia
    const mostrarCampoDepartamento = hasRole('EMPLEADO') || hasRole('ADMINISTRADOR') || hasRole('RECURSOS_HUMANOS') || hasRole('JEFE_DEPARTAMENTO');
    const mostrarCamposHorario = mostrarCampoDepartamento; 
    // Jefe de departamento
    const mostrarCampoJefe = hasRole('EMPLEADO') || hasRole('ADMINISTRADOR') || hasRole('RECURSOS_HUMANOS');

    //VALIDACIONES EN TIEMPO REAL 
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

        setErrores(prev => ({
            ...prev,
            [name]: error
        }));
    };

    // Validar horas=
    useEffect(() => {
        if (formData.horaEntrada && formData.horaSalida) {
            if (formData.horaSalida <= formData.horaEntrada) {
                setErrores(prev => ({ ...prev, horaSalida: "La hora de salida debe ser posterior a la entrada" }));
            } else {
                setErrores(prev => ({ ...prev, horaSalida: null }));
            }
        }
    }, [formData.horaEntrada, formData.horaSalida]);

    // MANEJADORES DE ESTADO 
    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;
        
        // RESTRICCIONES DE TECLADO
        if (['nombre', 'apellidoPaterno', 'apellidoMaterno'].includes(name)) {
            // Solo permite letras y espacios.
            newValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ''); 
        } else if (name === 'telefono') {
            // Solo permite números
            newValue = value.replace(/\D/g, ''); 
        }

        setFormData(prev => ({ ...prev, [name]: newValue }));
        validarCampo(name, newValue);
    };

    const toggleRole = (rolValue) => {
        setFormData(prev => {
            const rolesActuales = prev.roles;
            let nuevosRoles = rolesActuales.includes(rolValue) 
                ? rolesActuales.filter(r => r !== rolValue) 
                : [...rolesActuales, rolValue];
            
            return { ...prev, roles: nuevosRoles };
        });
        
        if (errores.roles) {
            setErrores(prev => ({ ...prev, roles: null }));
        }
    };

    //VALIDACIÓN FINAL 
    const validarFormulario = () => {
        const nuevosErrores = { ...errores }; 
        let isValid = true;

        // Limpiar estado
        Object.keys(nuevosErrores).forEach(key => {
            if (nuevosErrores[key] === null) delete nuevosErrores[key];
        });

        // Validar vacios
        if (!formData.nombre.trim()) nuevosErrores.nombre = "Campo obligatorio";
        if (!formData.apellidoPaterno.trim()) nuevosErrores.apellidoPaterno = "Campo obligatorio";
        if (!formData.apellidoMaterno.trim()) nuevosErrores.apellidoMaterno = "Campo obligatorio";
        if (!formData.correo.trim()) nuevosErrores.correo = "Campo obligatorio";
        if (!formData.telefono) nuevosErrores.telefono = "Campo obligatorio";
        if (formData.roles.length === 0) nuevosErrores.roles = "Seleccione al menos un rol";

        // Validaciones condicionales por rol
        if (mostrarCampoDepartamento && !formData.departamentoId) {
            nuevosErrores.departamentoId = "Seleccione un departamento";
        }
        if (mostrarCampoJefe && !formData.jefeId) {
            nuevosErrores.jefeId = "Asigne un jefe de área";
        }

        // errores bloqueamos
        if (Object.keys(nuevosErrores).length > 0) {
            isValid = false;
            setErrores(nuevosErrores);
            setMostrarErrorGeneral(true);
            
            // Scroll hacia arriba
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
            await new Promise(resolve => setTimeout(resolve, 800)); 
            onSubmit(formData);
        } catch (error) {
            console.error("Error al crear usuario", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden relative">
                
                {/* Cabecera */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-2 text-[#0F2C59]">
                        <UserPlus size={24} />
                        <h2 className="text-xl font-bold">Crear Nuevo Usuario</h2>
                    </div>
                    <button onClick={onClose} disabled={isLoading} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Cuerpo del Formulario */}
                <div id="modal-scroll-container" className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-gray-50/30">
                    <form id="crear-usuario-form" onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Alerta General */}
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
                                    <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} disabled={isLoading} className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${errores.nombre ? 'border-red-400 focus:ring-2 focus:ring-red-200 bg-red-50/30' : 'border-gray-300 focus:border-[#0F2C59] focus:ring-2 focus:ring-[#0F2C59]/20'}`} />
                                    {errores.nombre && <p className="text-xs text-red-500 mt-1.5 animate-in fade-in">{errores.nombre}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Apellido Paterno *</label>
                                    <input type="text" name="apellidoPaterno" value={formData.apellidoPaterno} onChange={handleChange} disabled={isLoading} className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${errores.apellidoPaterno ? 'border-red-400 focus:ring-2 focus:ring-red-200 bg-red-50/30' : 'border-gray-300 focus:border-[#0F2C59] focus:ring-2 focus:ring-[#0F2C59]/20'}`} />
                                    {errores.apellidoPaterno && <p className="text-xs text-red-500 mt-1.5 animate-in fade-in">{errores.apellidoPaterno}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Apellido Materno *</label>
                                    <input type="text" name="apellidoMaterno" value={formData.apellidoMaterno} onChange={handleChange} disabled={isLoading} className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${errores.apellidoMaterno ? 'border-red-400 focus:ring-2 focus:ring-red-200 bg-red-50/30' : 'border-gray-300 focus:border-[#0F2C59] focus:ring-2 focus:ring-[#0F2C59]/20'}`} />
                                    {errores.apellidoMaterno && <p className="text-xs text-red-500 mt-1.5 animate-in fade-in">{errores.apellidoMaterno}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                                    <input type="tel" name="telefono" maxLength="10" value={formData.telefono} onChange={handleChange} placeholder="7771234567" disabled={isLoading} className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${errores.telefono ? 'border-red-400 focus:ring-2 focus:ring-red-200 bg-red-50/30' : 'border-gray-300 focus:border-[#0F2C59] focus:ring-2 focus:ring-[#0F2C59]/20'}`} />
                                    {errores.telefono ? (
                                        <p className="text-xs text-red-500 mt-1.5 animate-in fade-in">{errores.telefono}</p>
                                    ) : (
                                        <p className="text-xs text-gray-500 mt-1.5">Solo números (10 dígitos)</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email institucional *</label>
                                    <input type="email" name="correo" value={formData.correo} onChange={handleChange} placeholder="usuario@utez.edu.mx" disabled={isLoading} className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${errores.correo ? 'border-red-400 focus:ring-2 focus:ring-red-200 bg-red-50/30' : 'border-gray-300 focus:border-[#0F2C59] focus:ring-2 focus:ring-[#0F2C59]/20'}`} />
                                    {errores.correo && <p className="text-xs text-red-500 mt-1.5 animate-in fade-in">{errores.correo}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Configuración del Sistema */}
                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-gray-100">
                                <Shield size={16} className="text-[#0F2C59]"/> Roles y Asignaciones
                            </h3>

                            {/* Roles */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Roles * (Seleccione uno o más)</label>
                                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 p-4 border rounded-lg bg-gray-50/50 ${errores.roles ? 'border-red-400 bg-red-50/30' : 'border-gray-200'}`}>
                                    {ROLES_DISPONIBLES.map(opcion => (
                                        <label key={opcion.value} className="flex items-center gap-3 p-2 rounded hover:bg-white cursor-pointer transition-colors">
                                            <input type="checkbox" checked={formData.roles.includes(opcion.value)} onChange={() => toggleRole(opcion.value)} disabled={isLoading} className="w-4 h-4 text-[#0F2C59] rounded border-gray-300 focus:ring-[#0F2C59]" />
                                            <span className="text-sm text-gray-700">{opcion.label}</span>
                                        </label>
                                    ))}
                                </div>
                                {errores.roles && <p className="text-xs text-red-500 mt-1.5 animate-in fade-in">{errores.roles}</p>}
                            </div>

                            {/* Campos Dinámicos */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                {mostrarCampoDepartamento && (
                                    <div className="animate-in fade-in duration-300">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            <Building2 size={16} className="inline mr-1 text-gray-500"/> Departamento *
                                        </label>
                                        <select name="departamentoId" value={formData.departamentoId} onChange={handleChange} disabled={isLoading} className={`w-full px-4 py-2 border rounded-lg bg-white outline-none transition-all ${errores.departamentoId ? 'border-red-400 focus:ring-2 focus:ring-red-200 bg-red-50/30' : 'border-gray-300 focus:border-[#0F2C59] focus:ring-2 focus:ring-[#0F2C59]/20'}`}>
                                            <option value="">Seleccione un departamento...</option>
                                            {departamentos.map(depto => (
                                                <option key={depto.id} value={depto.id}>{depto.nombre}</option>
                                            ))}
                                        </select>
                                        {errores.departamentoId && <p className="text-xs text-red-500 mt-1.5 animate-in fade-in">{errores.departamentoId}</p>}
                                    </div>
                                )}

                                {mostrarCampoJefe && (
                                    <div className="animate-in fade-in duration-300">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Jefe de Área Asignado *</label>
                                        <select name="jefeId" value={formData.jefeId} onChange={handleChange} disabled={isLoading} className={`w-full px-4 py-2 border rounded-lg bg-white outline-none transition-all ${errores.jefeId ? 'border-red-400 focus:ring-2 focus:ring-red-200 bg-red-50/30' : 'border-gray-300 focus:border-[#0F2C59] focus:ring-2 focus:ring-[#0F2C59]/20'}`}>
                                            <option value="">Seleccione un jefe de área...</option>
                                            {jefesActivos.map(jefe => (
                                                <option key={jefe.id} value={jefe.id}>{jefe.nombre} - {jefe.departamento}</option>
                                            ))}
                                        </select>
                                        {errores.jefeId && <p className="text-xs text-red-500 mt-1.5 animate-in fade-in">{errores.jefeId}</p>}
                                    </div>
                                )}
                            </div>

                            {/* Horarios Dinámicos */}
                            {mostrarCamposHorario && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 animate-in fade-in duration-300">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            <Clock size={16} className="inline mr-1 text-gray-500"/> Hora Inicio Jornada *
                                        </label>
                                        <input type="time" name="horaEntrada" value={formData.horaEntrada} onChange={handleChange} disabled={isLoading} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F2C59]/20 focus:border-[#0F2C59] outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            <Clock size={16} className="inline mr-1 text-gray-500"/> Hora Fin Jornada *
                                        </label>
                                        <input type="time" name="horaSalida" value={formData.horaSalida} onChange={handleChange} disabled={isLoading} className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${errores.horaSalida ? 'border-red-400 focus:ring-2 focus:ring-red-200 bg-red-50/30' : 'border-gray-300 focus:border-[#0F2C59] focus:ring-2 focus:ring-[#0F2C59]/20'}`} />
                                        {errores.horaSalida && <p className="text-xs text-red-500 mt-1.5 animate-in fade-in">{errores.horaSalida}</p>}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/*Aviso*/}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Send className="text-blue-600" size={20} />
                                </div>
                                <div>
                                    <h4 className="font-medium text-blue-900 mb-1">Contraseña Generada Automáticamente</h4>
                                    <p className="text-sm text-blue-700 mb-2">Al crear el usuario, se enviará una contraseña segura aleatoria al correo electrónico institucional.</p>
                                </div>
                            </div>
                        </div>

                    </form>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex flex-col-reverse sm:flex-row justify-end gap-3 bg-white">
                    <button type="button" onClick={onClose} disabled={isLoading} className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 border border-gray-300 rounded-lg transition-colors">
                        Cancelar
                    </button>
                    <button type="submit" form="crear-usuario-form" disabled={isLoading || Object.keys(errores).length > 0} className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-white bg-[#28A745] hover:bg-[#218838] disabled:bg-green-400 disabled:cursor-not-allowed rounded-lg shadow-sm transition-all flex items-center justify-center gap-2">
                        {isLoading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Creando...</> : 'Crear Usuario'}
                    </button>
                </div>

            </div>
        </div>
    );
}