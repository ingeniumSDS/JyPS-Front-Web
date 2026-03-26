import { useState } from 'react';
import { FileCheck, Calendar, User, FileText, Search } from 'lucide-react';
import {Card} from '../../components/Card';
import {Input} from '../../components/Input';

// Datos falsos locales
const MOCK_SOLICITUDES = [
  {
    id: 1,
    tipo: 'justificante',
    estado: 'aprobado',
    trabajador: { nombre: 'Juan Pérez García', email: 'juan.perez@utez.edu.mx', departamento: 'Sistemas' },
    fecha: '2026-02-24T10:00:00',
    motivo: 'Consulta médica general - Revisión periódica programada',
    evidencia: 'receta_medica.pdf',
    aprobadoPor: 'Roberto Sánchez López'
  },
  {
    id: 2,
    tipo: 'justificante',
    estado: 'aprobado',
    trabajador: { nombre: 'Ana Martínez López', email: 'ana.martinez@utez.edu.mx', departamento: 'Docencia' },
    fecha: '2026-02-19T09:00:00',
    motivo: 'Cita médica - Control de embarazo',
    evidencia: 'cita_ginecologia.pdf',
    aprobadoPor: 'Roberto Sánchez López'
  }
];

export default function Justificantes() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filtroFecha, setFiltroFecha] = useState('todos');
    const [filtroDepartamento, setFiltroDepartamento] = useState('todos');

  // Filtrar justificantes aprobados
    const justificantesAprobados = MOCK_SOLICITUDES.filter(
        s => s.tipo === 'justificante' && s.estado === 'aprobado'
    );

  //filtrar por quincena
    const filtrarPorFecha = (solicitudes) => {
    const hoy = new Date();
    const mesActual = hoy.getMonth();
    const anioActual = hoy.getFullYear();

    switch (filtroFecha) {
        case 'quincena1':
        return solicitudes.filter(s => {
            const fecha = new Date(s.fecha);
            return fecha.getMonth() === mesActual &&
                    fecha.getFullYear() === anioActual &&
                    fecha.getDate() >= 1 &&
                    fecha.getDate() <= 15;
        });
        case 'quincena2':
        return solicitudes.filter(s => {
            const fecha = new Date(s.fecha);
            return fecha.getMonth() === mesActual &&
                    fecha.getFullYear() === anioActual &&
                    fecha.getDate() >= 16;
        });
        case 'mes':
        return solicitudes.filter(s => {
            const fecha = new Date(s.fecha);
            return fecha.getMonth() === mesActual &&
                    fecha.getFullYear() === anioActual;
        });
        default:
        return solicitudes;
    }
  };

    //filtros de fecha y departamento
    let filteredJustificantes = filtrarPorFecha(justificantesAprobados);
    if (filtroDepartamento !== 'todos') {
        filteredJustificantes = filteredJustificantes.filter(
        j => j.trabajador.departamento === filtroDepartamento
        );
    }

  // Filtrar por busqueda de texto
  filteredJustificantes = filteredJustificantes.filter(j =>
    j.trabajador.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.trabajador.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.motivo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="p-4 sm:p-6 md:p-2">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0F2C59]">Justificantes Aprobados</h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">Registro de justificantes autorizados</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#28A745]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileCheck size={24} className="text-[#28A745]" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Aprobados</p>
              <p className="text-2xl font-bold text-[#0F2C59]">{justificantesAprobados.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-4 sm:p-6 mb-6">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Buscar por nombre, email o motivo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>

          {/* Filtros */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtros
            </label>
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
              {/* Botones de periodo */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setFiltroFecha('todos')}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition-all ${
                    filtroFecha === 'todos'
                      ? 'bg-[#0F2C59] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Todos ({justificantesAprobados.length})
                </button>
                <button
                  onClick={() => setFiltroFecha('quincena1')}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition-all ${
                    filtroFecha === 'quincena1'
                      ? 'bg-[#28A745] text-white shadow-sm'
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                >
                  1ra Quincena (1-15)
                </button>
                <button
                  onClick={() => setFiltroFecha('quincena2')}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition-all ${
                    filtroFecha === 'quincena2'
                      ? 'bg-[#28A745] text-white shadow-sm'
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                >
                  2da Quincena (16-fin)
                </button>
                <button
                  onClick={() => setFiltroFecha('mes')}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition-all ${
                    filtroFecha === 'mes'
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                  }`}
                >
                  Mes Completo
                </button>
              </div>

              {/* Select de Departamento (Lo que pediste en rosa) */}
              <select
                value={filtroDepartamento}
                onChange={(e) => setFiltroDepartamento(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F2C59] bg-white lg:w-48"
              >
                <option value="todos">Todos los departamentos</option>
                <option value="Sistemas">Sistemas</option>
                <option value="Docencia">Docencia</option>
                <option value="Administración">Administración</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* List */}
      <div className="space-y-4">
        {filteredJustificantes.length === 0 ? (
          <Card className="p-8 text-center">
            <FileCheck size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm sm:text-base">
              {searchTerm ? 'No se encontraron justificantes con ese criterio' : 'No hay justificantes aprobados'}
            </p>
          </Card>
        ) : (
          filteredJustificantes.map((justificante) => (
            <Card key={justificante.id} className="p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#0F2C59] rounded-full flex items-center justify-center flex-shrink-0">
                      <User size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0F2C59] text-sm sm:text-base">{justificante.trabajador.nombre}</h3>
                      <p className="text-xs sm:text-sm text-gray-600">{justificante.trabajador.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                    <div className="flex items-start gap-2 text-xs sm:text-sm">
                      <Calendar size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-gray-600 mr-1">Fecha:</span>
                        <span className="font-medium text-[#0F2C59]">{formatDate(justificante.fecha)}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-xs sm:text-sm">
                      <FileText size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-gray-600 mr-1">Motivo:</span>
                        <span className="font-medium text-[#0F2C59]">{justificante.motivo}</span>
                      </div>
                    </div>
                  </div>

                  {justificante.evidencia && (
                    <div className="mt-3 flex items-center gap-2 text-xs sm:text-sm">
                      <FileCheck size={16} className="text-[#28A745] flex-shrink-0" />
                      <span className="text-gray-600">Evidencia:</span>
                      <span className="font-medium text-[#28A745] truncate">{justificante.evidencia}</span>
                    </div>
                  )}

                  {justificante.aprobadoPor && (
                    <div className="mt-3 text-xs text-gray-400">
                      Aprobado por: {justificante.aprobadoPor}
                    </div>
                  )}
                </div>

                <div className="flex items-center lg:justify-end">
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#28A745]/10 text-[#28A745] rounded-full text-xs sm:text-sm font-medium">
                    <FileCheck size={16} />
                    Aprobado
                  </span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}