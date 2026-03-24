import { createBrowserRouter } from "react-router-dom";
// Administrador
import AdministradorLayout from "./pages/administrador/AdministradorLayout";
import GestionUsuarios from "./pages/administrador/GestionUsuarios";
import GestionDepartamentos from "./pages/administrador/GestionDepartamentos"; 

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
    // Rutas protegidas (panel de administrador)
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
          element: <GestionDepartamentos />
        }
      ]
    }
]);