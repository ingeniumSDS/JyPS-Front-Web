# 👥 Panel de Administración de Usuarios (User Management Dashboard)

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

Una aplicación frontend moderna y escalable diseñada para la gestión integral del ciclo de vida de los usuarios (CRUD). Este proyecto no solo se enfoca en la funcionalidad, sino en aplicar **buenas prácticas de Ingeniería de Software**, código limpio (Clean Code) y una arquitectura altamente mantenible.

## ✨ Características Principales

* **Gestión Integral (CRUD):** Creación, lectura y edición de usuarios conectados a una API REST.
* **Filtros Avanzados en Tiempo Real:** Búsqueda multicriterio (por nombre, correo, rol, departamento y estado) sin recargar la página.
* **Validaciones Dinámicas:** Feedback visual instantáneo en formularios (validación de correos institucionales, longitud de texto y formatos numéricos).
* **Diseño Responsivo (Mobile-First):** Interfaz construida con Tailwind CSS, garantizando fluidez desde dispositivos móviles hasta pantallas de escritorio.

## 🏗️ Arquitectura y Patrones de Diseño

El proyecto fue construido siguiendo principios de **Clean Architecture** adaptados al ecosistema de React, dividiendo la aplicación en tres capas estrictas (Separation of Concerns):

1. **Capa de Infraestructura (`useApi.js`):** Un motor HTTP agnóstico. Se encarga exclusivamente de las peticiones de red, inyección de headers, manejo de CORS y parseo seguro de respuestas (evitando fallos por JSON vacíos en status 201/204).
2. **Capa de Dominio/Servicios (`useUsuarios.js`):** Contiene la lógica de negocio. Actúa como un **Patrón Adaptador (Mapper)**, transformando los modelos de datos crudos del backend en modelos amigables para el frontend, aislando a la UI de futuros cambios en la API.
3. **Capa de Presentación (Componentes y Modales):** Componentes dedicados 100% a la UI. 

### Patrones de Diseño Implementados:
* **Container / Presenter Pattern:** Separación entre componentes que manejan el estado global (`GestionUsuarios.jsx`) y componentes "tontos" que solo dibujan la UI y emiten eventos (`CrearUsuarioModal.jsx`).
* **Principio DRY (Don't Repeat Yourself):** Reutilización del 100% del componente modal y sus validaciones tanto para la **Creación (POST)** como para la **Edición (PUT)** mediante la inyección de propiedades dinámicas (`usuarioAEditar`).

## 📊 Flujo de Datos y Reutilización de Componentes

El siguiente diagrama ilustra cómo la vista principal delega la responsabilidad al modal inteligente, el cual adapta su comportamiento según el contexto (Crear vs Editar):

```mermaid
graph TD
    A[Vista: GestionUsuarios] -->|Clic en 'Nuevo'| B(Estado: usuarioAEditar = null)
    A -->|Clic en 'Editar'| C(Estado: usuarioAEditar = datosUsuario)
    
    B --> D{CrearUsuarioModal}
    C --> D
    
    D -->|useEffect| E{¿Tiene datos?}
    
    E -->|No| F[Modo CREACIÓN<br/>Inputs Vacíos]
    E -->|Sí| G[Modo EDICIÓN<br/>Inputs Pre-llenados]
    
    F --> H[Validaciones en Tiempo Real]
    G --> H
    
    H -->|Submit válido| I[Hook: useUsuarios]
    
    I -->|POST /usuarios| J[(Backend REST API)]
    I -->|PUT /usuarios/:id| J

    ```markdown
## 📁 Estructura del Proyecto

\`\`\`text
src/
 ├── components/       # Componentes visuales reutilizables (Botones, Cards, Modales)
 │    └── modals/      # Modales inteligentes (ej. CrearUsuarioModal.jsx)
 ├── hooks/            # Custom Hooks (Lógica de negocio e infraestructura)
 │    ├── useApi.js    # Fetch wrapper centralizado
 │    └── useUsuarios.js # Capa de dominio (Adaptadores y endpoints)
 ├── pages/            # Vistas principales (ej. GestionUsuarios.jsx)
 └── App.jsx           # Enrutamiento principal
\`\`\`

## 🚀 Instalación y Despliegue Local

1. Clona el repositorio:
   \`\`\`bash
   git clone https://github.com/TU_USUARIO/TU_REPOSITORIO.git
   \`\`\`
2. Instala las dependencias:
   \`\`\`bash
   npm install
   \`\`\`
3. Configura las variables de entorno:
   * Crea un archivo `.env` en la raíz.
   * Agrega la URL del backend: `VITE_API_BASE_URL=tu_url_aqui`
4. Ejecuta el servidor de desarrollo:
   \`\`\`bash
   npm run dev
   \`\`\`
