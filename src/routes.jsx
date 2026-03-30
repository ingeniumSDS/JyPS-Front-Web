import { createBrowserRouter, Navigate} from "react-router-dom";
// Jefe de departamento
import JefeLayout from "./pages/jefe-area/JefeLayout.jsx";
import DashboardJefe from "./pages/jefe-area/DashboardJefe.jsx";

// Administrador
import AdministradorLayout from "./pages/administrador/AdministradorLayout";
import GestionUsuarios from "./pages/administrador/GestionUsuarios";
import GestionDepartamentos from "./pages/administrador/GestionDepartamentos"; 

// Trabajador
import TrabajadorLayout from "./pages/trabajador/TrabajadorLayout";
import DashboardTrabajador from "./pages/trabajador/DashboardTrabajador";
import SolicitarPase from "./pages/trabajador/SolicitarPase";
import SolicitarJustificante from "./pages/trabajador/SolicitarJustificante.jsx";
//Recursos Humanos
import RRHHLayout from "./pages/rrhh/RRHHLayout.jsx";
import RRHHjustificantes from "./pages/rrhh/RRHHjustificantes.jsx";
import RRHHPases from "./pages/rrhh/RRHHPases.jsx";

// Vistas Compartidas 
import Perfil from "./pages/globales/Perfil.jsx"; 
import Historial from "./pages/globales/Historial.jsx";

// Generales
import Login from "./pages/Login";
import Recuperar from "./pages/Recuperar";

export const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/recuperar",
      element: <Recuperar />,
    },

    // PANEL DE ADMINISTRADOR 
    {
    path: "/administrador",
    element: <AdministradorLayout />,
    children: [
      { 
        index: true, 
        element: <GestionUsuarios />
      },
      {
        path: "departamentos",
        element: <GestionDepartamentos/>
      },
      {
        path: "crear-solicitud", 
        element: <DashboardTrabajador/>
      },
      {
        path: "solicitar-pase", 
        element: <SolicitarPase/>
      },
      {
        path: "solicitar-justificante",
        element: <SolicitarJustificante/>
      },
      {
        path: "perfil",
        element: <Perfil />
      },
      {
        path: "historial",
        element: <Historial/>
      }
    ]
    },

    // PANEL DE TRABAJADOR 
    {
      path: "/trabajador",
      element : <TrabajadorLayout/>,
      children:[
        {
        index: true, 
        element: <DashboardTrabajador/>
        },
        {
          path: "trabajadores", // <--- TE FALTA AGREGAR ESTA RUTA
          element: <div>Vista de Trabajadores en construcción</div> // Cambiar por tu componente cuando lo crees
        },
        {
          path: "solicitar-pase", 
          element: <SolicitarPase/>
        },
        {
          path: "solicitar-justificante",
          element: <SolicitarJustificante/>
        },
        {
          path: "perfil",
          element: <Perfil />
        },
        {
          path: "historial",
          element: <Historial/>
        }
      ]
    },
    // Panel de Recursos Humanos
    {
        path: "/recursos-humanos",
        element: <RRHHLayout />,
        children:[
          {
            index: true,
            element: <RRHHjustificantes /> 
          },
          { 
            path: 'pases-rh',
            element: <RRHHPases/>
          },
          {
            path: "crear-solicitud", 
            element: <DashboardTrabajador/>
          },
          {
            path: "solicitar-pase", 
            element: <SolicitarPase/>
          },
          {
            path: "solicitar-justificante",
            element: <SolicitarJustificante/>
          },
          {
            path: "perfil",
            element: <Perfil />
          },
          {
            path: "historial",
            element: <Historial/>
          }
        ]
    },
    // Panel de jefe de area
    {
        path: "/jefe-area",
        element: <JefeLayout/>,
        children:[
          {
            index: true,
            element: <DashboardJefe/>
          },
          {
            path: "crear-solicitud", 
            element: <DashboardTrabajador/>
          },
          {
            path: "solicitar-pase", 
            element: <SolicitarPase/>
          },
          {
            path: "solicitar-justificante",
            element: <SolicitarJustificante/>
          },
          {
            path: "perfil",
            element: <Perfil />
          },
          {
            path: "historial",
            element: <Historial/>
          }
        ]
    }
]);