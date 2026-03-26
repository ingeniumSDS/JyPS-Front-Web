import { createBrowserRouter } from "react-router-dom";

// Administrador
import AdministradorLayout from "./pages/administrador/AdministradorLayout";
import GestionUsuarios from "./pages/administrador/GestionUsuarios";
import GestionDepartamentos from "./pages/administrador/GestionDepartamentos"; 

// Trabajador
import TrabajadorLayout from "./pages/trabajador/TrabajadorLayout";
import DashboardTrabajador from "./pages/trabajador/DashboardTrabajador";
import SolicitarPase from "./pages/trabajador/SolicitarPase";
import SolicitarJustificante from "./pages/trabajador/SolicitarJustificante.jsx";

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
      // Ponemos pase y justificante al mismo nivel
      {
        path: "pase", 
        element: <SolicitarPase/>
      },
      {
        path: "justificante",
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
          path: "pase", 
          element: <SolicitarPase/>
        },
        {
          path: "justificante",
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