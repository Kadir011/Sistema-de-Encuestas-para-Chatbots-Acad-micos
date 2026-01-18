# ChatBots Education Survey Platform

Una aplicación full-stack integral para recopilar y analizar datos sobre el uso de chatbots de IA en contextos educativos. Esta plataforma permite a estudiantes, profesores y administradores compartir sus experiencias y generar información valiosa sobre la integración de IA en la educación.

## Demo en Vivo

[Enlace a la aplicación desplegada - si está disponible]

## Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Características](#características)
- [Stack Tecnológico](#stack-tecnológico)
- [Arquitectura](#arquitectura)
- [Primeros Pasos](#primeros-pasos)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Documentación de la API](#documentación-de-la-api)
- [Esquema de Base de Datos](#esquema-de-base-de-datos)
- [Autenticación y Autorización](#autenticación-y-autorización)
- [Variables de Entorno](#variables-de-entorno)
- [Desarrollo](#desarrollo)
- [Pruebas](#pruebas)
- [Despliegue](#despliegue)
- [Contribuir](#contribuir)
- [Licencia](#licencia)
- [Contacto](#contacto)

## Descripción General

La Plataforma de Encuestas sobre ChatBots Educativos aborda la creciente necesidad de comprender cómo se están adoptando las herramientas de inteligencia artificial en entornos educativos. Al proporcionar experiencias de encuestas separadas y adaptadas para estudiantes y profesores, la plataforma captura datos detallados sobre patrones de uso, efectividad y desafíos de los chatbots.

La aplicación cuenta con control de acceso basado en roles, visualización de estadísticas en tiempo real, capacidades de exportación de datos y un diseño responsivo que funciona perfectamente en todos los dispositivos.

## Características

### Para Estudiantes
- Completar encuestas detalladas sobre el uso de chatbots en contextos académicos
- Rastrear historial personal de encuestas
- Ver estadísticas e información personalizada
- Acceder a tendencias de uso y recomendaciones

### Para Profesores
- Enviar encuestas completas sobre la integración de chatbots en la enseñanza
- Soporte multi-país para educadores internacionales
- Analizar métricas específicas de enseñanza
- Revisar datos agregados sobre aplicaciones pedagógicas

### Para Administradores
- Panel de control integral con análisis en tiempo real
- Sistema de gestión de usuarios
- Exportar datos a Excel para análisis externo
- Acceso a todas las encuestas y estadísticas agregadas
- Representación visual de datos a través de gráficos

### Características Generales
- Autenticación segura con tokens JWT
- Control de acceso basado en roles (Estudiante, Profesor, Administrador)
- Diseño responsivo optimizado para móvil y escritorio
- Soporte de modo oscuro
- Capacidades de filtrado y búsqueda de datos
- Gráficos y visualizaciones interactivas
- Arquitectura API RESTful

## Stack Tecnológico

### Frontend
- **React 19.2.0** - Librería de UI
- **React Router DOM 7.12.0** - Enrutamiento del lado del cliente
- **Tailwind CSS 4.1.18** - Framework CSS de utilidades
- **Chart.js 4.5.1** - Visualización de datos
- **Axios 1.13.2** - Cliente HTTP
- **Lucide React 0.562.0** - Librería de íconos
- **XLSX 0.18.5** - Generación de archivos Excel
- **Vite 7.2.4** - Herramienta de construcción y servidor de desarrollo

### Backend
- **Node.js** - Entorno de ejecución
- **Express 5.2.1** - Framework web
- **PostgreSQL 8.16.3** - Base de datos relacional
- **JWT (jsonwebtoken 9.0.3)** - Autenticación
- **Bcrypt 6.0.0** - Hash de contraseñas
- **CORS 2.8.5** - Compartir recursos entre orígenes
- **Dotenv 17.2.3** - Gestión de variables de entorno

## Arquitectura

La aplicación sigue una arquitectura de tres niveles:
```
┌─────────────────────────────────────────────────────────┐
│                   Capa de Cliente                       │
│  (React SPA con React Router y Gestión de Estado)      │
└──────────────────┬──────────────────────────────────────┘
                   │
                   │ HTTP/REST API
                   │
┌──────────────────▼──────────────────────────────────────┐
│                 Capa de Aplicación                      │
│  (Express.js con Patrón MVC y Middleware)              │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │
│  │Controladores │  │  Middleware  │  │    Rutas    │  │
│  └──────────────┘  └──────────────┘  └─────────────┘  │
│  ┌──────────────┐  ┌──────────────┐                   │
│  │   Modelos    │  │   Servicios  │                   │
│  └──────────────┘  └──────────────┘                   │
└──────────────────┬──────────────────────────────────────┘
                   │
                   │ Consultas PostgreSQL
                   │
┌──────────────────▼──────────────────────────────────────┐
│                   Capa de Datos                         │
│              (Base de Datos PostgreSQL)                 │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │
│  │   Usuarios   │  │   Encuestas  │  │Estadísticas │  │
│  └──────────────┘  └──────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Patrones de Diseño

- **MVC (Modelo-Vista-Controlador)**: Clara separación de responsabilidades
- **Patrón Repositorio**: Capa de acceso a datos abstraída
- **Patrón Middleware**: Pipeline de procesamiento de solicitudes
- **Context API**: Gestión de estado global en React
- **Custom Hooks**: Extracción de lógica reutilizable

## Primeros Pasos

### Requisitos Previos

- Node.js 18.x o superior
- PostgreSQL 14.x o superior
- Gestor de paquetes npm o yarn

### Instalación

1. Clonar el repositorio
```bash
git clone https://github.com/Kadir011/Sistema-de-Encuestas-para-Chatbots-Acad-micos.git
cd Sistema-de-Encuestas-para-Chatbots-Acad-micos
```

2. Ejecutar el script de configuración automatizado
```bash
chmod +x setup.sh
./setup.sh
```

El script:
- Instalará las dependencias del frontend y backend
- Creará archivos de configuración de entorno
- Configurará la base de datos PostgreSQL
- Inicializará las tablas y creará el usuario administrador

3. Configurar las variables de entorno

Backend (`backend/.env`):
```env
PORT=5000
NODE_ENV=development

# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_contraseña
DB_DATABASE=chatbots_system

# JWT
JWT_SECRET=tu_clave_secreta_segura
JWT_EXPIRE=7d

# CORS
FRONTEND_URL=http://localhost:5173
```

Frontend (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

4. Iniciar los servidores de desarrollo

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

La aplicación estará disponible en:
- Frontend: http://localhost:5173
- API Backend: http://localhost:5000

### Credenciales de Administrador por Defecto
```
Email: admin@gmail.com
Contraseña: admin123
```

## Estructura del Proyecto
```
chatbots-survey-platform/
├── backend/
│   ├── config/
│   │   └── database.js              # Configuración de conexión a BD
│   ├── controllers/
│   │   ├── authController.js         # Lógica de autenticación
│   │   ├── studentSurveyController.js # CRUD encuestas estudiantes
│   │   ├── teacherSurveyController.js # CRUD encuestas profesores
│   │   ├── userController.js          # Gestión de usuarios
│   │   └── exportController.js        # Funcionalidad de exportación
│   ├── database/
│   │   └── init.sql                   # Script de inicialización de BD
│   ├── middlewares/
│   │   ├── authMiddleware.js          # Verificación JWT
│   │   └── validationMiddleware.js    # Validación de entrada
│   ├── models/
│   │   ├── User.js                    # Modelo de usuario
│   │   ├── StudentSurvey.js           # Modelo encuesta estudiante
│   │   └── TeacherSurvey.js           # Modelo encuesta profesor
│   ├── routes/
│   │   ├── authRoutes.js              # Endpoints de autenticación
│   │   ├── userRoutes.js              # Endpoints gestión usuarios
│   │   ├── studentSurveyRoutes.js     # Endpoints encuestas estudiantes
│   │   ├── teacherSurveyRoutes.js     # Endpoints encuestas profesores
│   │   └── exportRoutes.js            # Endpoints de exportación
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js                      # Punto de entrada de la aplicación
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/                 # Componentes específicos admin
│   │   │   ├── auth/                  # Componentes de autenticación
│   │   │   ├── common/                # Componentes UI reutilizables
│   │   │   ├── dashboard/             # Componentes del dashboard
│   │   │   ├── layout/                # Componentes de diseño
│   │   │   └── surveys/               # Componentes de encuestas
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx        # Estado de autenticación
│   │   │   ├── ThemeContext.jsx       # Gestión de tema
│   │   │   └── SurveyContext.jsx      # Estado de encuestas
│   │   ├── hooks/
│   │   │   ├── useAuth.js             # Hook de autenticación
│   │   │   ├── useForm.js             # Hook manejo de formularios
│   │   │   └── usePagination.js       # Hook de paginación
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AdminPanel.jsx
│   │   │   ├── StudentSurvey.jsx
│   │   │   ├── TeacherSurvey.jsx
│   │   │   ├── MySurveys.jsx
│   │   │   ├── Statistics.jsx
│   │   │   ├── UserManagement.jsx
│   │   │   └── Profile.jsx
│   │   ├── services/
│   │   │   ├── api.js                 # Configuración instancia Axios
│   │   │   ├── authService.js         # Llamadas API autenticación
│   │   │   ├── surveyService.js       # Llamadas API encuestas
│   │   │   ├── userService.js         # Llamadas API usuarios
│   │   │   └── exportService.js       # Llamadas API exportación
│   │   ├── styles/
│   │   │   ├── animations.css
│   │   │   └── utilities.css
│   │   ├── utils/
│   │   │   ├── constants.js           # Constantes de aplicación
│   │   │   ├── formatters.js          # Utilidades de formato de datos
│   │   │   ├── helpers.js             # Funciones auxiliares
│   │   │   └── validators.js          # Funciones de validación
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── setup.sh                           # Script de configuración automatizado
├── .gitignore
└── README.md
```

## Documentación de la API

### Endpoints de Autenticación

#### Registrar Usuario
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "student" | "teacher"
}
```

#### Iniciar Sesión
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string",
  "role": "student" | "teacher" | "admin"
}
```

#### Obtener Perfil
```http
GET /api/auth/profile
Authorization: Bearer {token}
```

### Endpoints de Encuestas

#### Crear Encuesta de Estudiante
```http
POST /api/student-surveys
Authorization: Bearer {token}
Content-Type: application/json

{
  "has_used_chatbot": boolean,
  "chatbots_used": string[],
  "usage_frequency": string,
  "usefulness_rating": number,
  "tasks_used_for": string[],
  "overall_experience": number,
  "preferred_chatbot": string,
  "effectiveness_comparison": string,
  "will_continue_using": boolean,
  "would_recommend": boolean,
  "additional_comments": string
}
```

#### Obtener Mis Encuestas
```http
GET /api/student-surveys/my-surveys
Authorization: Bearer {token}
```

#### Obtener Estadísticas de Encuestas
```http
GET /api/student-surveys/statistics
Authorization: Bearer {token}
```

### Endpoints de Exportación

#### Exportar Encuestas de Estudiantes a Excel
```http
GET /api/export/student-surveys?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
Authorization: Bearer {token}
```

Para documentación completa de la API, consulte la [Referencia de API](docs/api-reference.md).

## Esquema de Base de Datos

### Tabla de Usuarios
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabla de Encuestas de Estudiantes
```sql
CREATE TABLE student_surveys (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    has_used_chatbot BOOLEAN NOT NULL,
    chatbots_used TEXT[],
    usage_frequency VARCHAR(50),
    usefulness_rating INTEGER CHECK (usefulness_rating >= 1 AND usefulness_rating <= 5),
    tasks_used_for TEXT[],
    overall_experience INTEGER CHECK (overall_experience >= 1 AND overall_experience <= 5),
    preferred_chatbot VARCHAR(100),
    effectiveness_comparison VARCHAR(100),
    will_continue_using BOOLEAN,
    would_recommend BOOLEAN,
    additional_comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabla de Encuestas de Profesores
```sql
CREATE TABLE teacher_surveys (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    has_used_chatbot BOOLEAN NOT NULL,
    chatbots_used TEXT[],
    courses_used TEXT[],
    purposes TEXT[],
    outcomes TEXT[],
    challenges TEXT[],
    likelihood_future_use VARCHAR(50),
    advantages TEXT[],
    concerns TEXT[],
    resources_needed TEXT[],
    would_recommend BOOLEAN,
    age_range VARCHAR(50),
    institution_type VARCHAR(100),
    countries TEXT[],
    years_experience VARCHAR(50),
    additional_comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Autenticación y Autorización

La aplicación implementa autenticación basada en JWT con control de acceso basado en roles:

1. **Generación de Tokens**: Al iniciar sesión exitosamente, se genera un token JWT con el ID del usuario
2. **Almacenamiento de Tokens**: Los tokens se almacenan en localStorage del lado del cliente
3. **Autorización de Solicitudes**: Cada solicitud protegida incluye el token en el encabezado Authorization
4. **Verificación de Tokens**: El middleware del servidor verifica los tokens antes de procesar solicitudes
5. **Verificación de Roles**: Middleware adicional verifica los roles de usuario para rutas protegidas

### Medidas de Seguridad
- Contraseñas hasheadas con bcrypt (10 rondas de salt)
- Tokens JWT expiran después de 7 días (configurable)
- CORS configurado para aceptar solicitudes solo de orígenes confiables
- Validación y sanitización de entrada en todos los endpoints
- Prevención de inyección SQL mediante consultas parametrizadas

## Variables de Entorno

### Configuración del Backend

| Variable | Descripción | Por Defecto |
|----------|-------------|-------------|
| PORT | Puerto del servidor | 5000 |
| NODE_ENV | Modo de entorno | development |
| DB_HOST | Host de PostgreSQL | localhost |
| DB_PORT | Puerto de PostgreSQL | 5432 |
| DB_USERNAME | Usuario de base de datos | postgres |
| DB_PASSWORD | Contraseña de base de datos | - |
| DB_DATABASE | Nombre de base de datos | chatbots_system |
| JWT_SECRET | Clave secreta para JWT | - |
| JWT_EXPIRE | Tiempo de expiración del token | 7d |
| FRONTEND_URL | URL del frontend para CORS | http://localhost:5173 |

### Configuración del Frontend

| Variable | Descripción | Por Defecto |
|----------|-------------|-------------|
| VITE_API_URL | URL de la API del backend | http://localhost:5000/api |

## Desarrollo

### Estilo de Código

El proyecto sigue estas convenciones:
- Configuración ESLint para calidad de código
- Convenciones de nomenclatura consistentes (camelCase para variables, PascalCase para componentes)
- Estructura de componentes modular
- Separación de responsabilidades (UI, lógica, llamadas API)

### Scripts Disponibles

Backend:
```bash
npm run dev      # Iniciar servidor de desarrollo con nodemon
npm start        # Iniciar servidor de producción
```

Frontend:
```bash
npm run dev      # Iniciar servidor de desarrollo Vite
npm run build    # Construir para producción
npm run preview  # Previsualizar construcción de producción
npm run lint     # Ejecutar ESLint
```

### Agregar Nuevas Características

1. Crear rama de características desde main
2. Implementar cambios siguiendo la estructura del proyecto
3. Agregar pruebas necesarias
4. Actualizar documentación
5. Enviar pull request con descripción detallada

## Pruebas

Actualmente, el proyecto no incluye pruebas automatizadas. Las mejoras futuras deberían incluir:

- Pruebas unitarias para modelos y utilidades
- Pruebas de integración para endpoints de API
- Pruebas de componentes para componentes React
- Pruebas end-to-end para flujos de usuario críticos

Frameworks de prueba recomendados:
- Backend: Jest, Supertest
- Frontend: Vitest, React Testing Library, Cypress

## Despliegue

### Despliegue del Backend

Plataformas recomendadas: Heroku, Railway, Render, DigitalOcean

1. Configurar base de datos PostgreSQL en la plataforma de alojamiento
2. Configurar variables de entorno
3. Desplegar código de aplicación
4. Ejecutar script de inicialización de base de datos

### Despliegue del Frontend

Plataformas recomendadas: Vercel, Netlify, Cloudflare Pages

1. Construir el paquete de producción: `npm run build`
2. Configurar variables de entorno
3. Desplegar la carpeta `dist`
4. Configurar dominio personalizado (opcional)

### Consideraciones de Producción

- Usar configuraciones específicas del entorno
- Habilitar HTTPS
- Configurar políticas CORS apropiadas
- Implementar limitación de tasa
- Configurar pooling de conexiones de base de datos
- Habilitar registro y monitoreo
- Configurar copias de seguridad automatizadas

## Contribuir

Las contribuciones son bienvenidas. Por favor siga estas pautas:

1. Fork del repositorio
2. Crear una rama de características (`git checkout -b feature/caracteristica-increible`)
3. Commit de sus cambios (`git commit -m 'Agregar alguna característica increíble'`)
4. Push a la rama (`git push origin feature/caracteristica-increible`)
5. Abrir un Pull Request

Por favor asegúrese de que su código:
- Sigue el estilo de código existente
- Incluye comentarios apropiados
- Actualiza la documentación relevante
- No rompe funcionalidad existente

## Licencia

Este proyecto está licenciado bajo la Licencia ISC.

## Contacto

**Kadir Barquet**

- LinkedIn: [linkedin.com/in/kadir-barquet-bravo](https://www.linkedin.com/in/kadir-barquet-bravo/)
- Email: barquetbravokadir@gmail.com
- GitHub: [github.com/Kadir011](https://github.com/Kadir011)

Enlace del Proyecto: [https://github.com/Kadir011/Sistema-de-Encuestas-para-Chatbots-Acad-micos](https://github.com/Kadir011/Sistema-de-Encuestas-para-Chatbots-Acad-micos)

---

**Nota**: Esta plataforma fue desarrollada como parte de una investigación educativa sobre la adopción de chatbots de IA en contextos académicos. Los datos recopilados ayudan a comprender patrones de uso, efectividad y desafíos en la implementación de herramientas de IA para fines educativos.