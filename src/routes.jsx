import { createBrowserRouter } from "react-router-dom";
import RutaProtegida from "./components/utils/RutaProtegida.jsx"; 

// --- Módulo: Guardia ---
import GuardiaLayout from "./pages/guardia/GuardiaLayout.jsx";
import ValidadorCodigo from "./pages/guardia/ValidadorCodigo.jsx";

// --- Módulo: Jefe de Departamento ---
import JefeLayout from "./pages/jefe-area/JefeLayout.jsx";
import DashboardJefe from "./pages/jefe-area/DashboardJefe.jsx";
import JefeCrearTabajador from "./pages/jefe-area/JefeCrearTabajador.jsx";

// --- Módulo: Administrador ---
import AdministradorLayout from "./pages/administrador/AdministradorLayout";
import GestionUsuarios from "./pages/administrador/GestionUsuarios";
import GestionDepartamentos from "./pages/administrador/GestionDepartamentos"; 

// --- Módulo: Trabajador ---
import TrabajadorLayout from "./pages/trabajador/TrabajadorLayout";
import DashboardTrabajador from "./pages/trabajador/DashboardTrabajador";
import SolicitarPase from "./pages/trabajador/SolicitarPase";
import SolicitarJustificante from "./pages/trabajador/SolicitarJustificante.jsx";

// --- Módulo: Recursos Humanos ---
import RRHHLayout from "./pages/rrhh/RRHHLayout.jsx";
import RRHHjustificantes from "./pages/rrhh/RRHHjustificantes.jsx";
import RRHHPases from "./pages/rrhh/RRHHPases.jsx";

// --- Vistas Globales / Compartidas ---
import Perfil from "./pages/globales/Perfil.jsx"; 
import Historial from "./pages/globales/Historial.jsx";

// --- Autenticación ---
import Login from "./pages/Login";
import Recuperar from "./pages/Recuperar";
import NuevaPassword from './pages/NuevaPassword';

export const router = createBrowserRouter([
    // Rutas de acceso público
    { path: "/", element: <Login /> },
    { path: "/login", element: <Login /> },
    { path: "/recuperar", element: <Recuperar /> },
    { path: "/establecer-contrasena/:token", element: <NuevaPassword/> },

    // Módulo Administrador (Acceso total al sistema)
    {
      path: "/administrador",
      element: (
        <RutaProtegida rolesPermitidos={['ADMINISTRADOR']}>
            <AdministradorLayout />
        </RutaProtegida>
      ),
      children: [
        { index: true, element: <GestionUsuarios /> },
        { path: "departamentos", element: <GestionDepartamentos/> },
        { path: "crear-solicitud", element: <DashboardTrabajador/> },
        { path: "solicitar-pase", element: <SolicitarPase/> },
        { path: "solicitar-justificante", element: <SolicitarJustificante/> },
        { path: "perfil", element: <Perfil /> },
        { path: "historial", element: <Historial/> }
      ]
    },

    // Módulo Trabajador (Acceso base de empleado)
    {
      path: "/trabajador",
      element: (
        <RutaProtegida rolesPermitidos={['TRABAJADOR']}>
            <TrabajadorLayout/>
        </RutaProtegida>
      ),
      children:[
        { index: true, element: <DashboardTrabajador/> },
        { path: "trabajadores", element: <div>Vista de Trabajadores en construcción</div> },
        { path: "solicitar-pase", element: <SolicitarPase/> },
        { path: "solicitar-justificante", element: <SolicitarJustificante/> },
        { path: "perfil", element: <Perfil /> },
        { path: "historial", element: <Historial/> }
      ]
    },

    // Módulo Recursos Humanos (Gestión de incidencias y pases)
    {
        path: "/recursos-humanos",
        element: (
          <RutaProtegida rolesPermitidos={['RECURSOS_HUMANOS']}>
              <RRHHLayout />
          </RutaProtegida>
        ),
        children:[
          { index: true, element: <RRHHjustificantes /> },
          { path: 'pases-rh', element: <RRHHPases/> },
          { path: "crear-solicitud", element: <DashboardTrabajador/> },
          { path: "solicitar-pase", element: <SolicitarPase/> },
          { path: "solicitar-justificante", element: <SolicitarJustificante/> },
          { path: "perfil", element: <Perfil /> },
          { path: "historial", element: <Historial/> }
        ]
    },

    // Módulo Jefe de Departamento (Gestión de área y personal a cargo)
    {
        path: "/jefe-area",
        element: (
          <RutaProtegida rolesPermitidos={['JEFE_DE_DEPARTAMENTO']}>
              <JefeLayout/>
          </RutaProtegida>
        ),
        children:[
          { index: true, element: <DashboardJefe/> },
          { path: "trabajadores", element: <JefeCrearTabajador/> },
          { path: "crear-solicitud", element: <DashboardTrabajador/> },
          { path: "solicitar-pase", element: <SolicitarPase/> },
          { path: "solicitar-justificante", element: <SolicitarJustificante/> },
          { path: "perfil", element: <Perfil /> },
          { path: "historial", element: <Historial/> }
        ]
    },

    // Módulo Guardia (Validación de accesos físicos)
    {
      path: "/guardia",
      element: (
        <RutaProtegida rolesPermitidos={['GUARDIA']}>
            <GuardiaLayout/>
        </RutaProtegida>
      ),
      children : [
          { index: true, element: <ValidadorCodigo/> }
      ]
    }
]);