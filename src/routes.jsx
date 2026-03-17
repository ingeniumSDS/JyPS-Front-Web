import { createBrowserRouter } from "react-router-dom";

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
  //rutas protegidas mas adelante
]);