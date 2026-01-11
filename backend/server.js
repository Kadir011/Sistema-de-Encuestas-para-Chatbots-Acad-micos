import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection, closePool } from './config/database.js';

// Importar rutas
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import studentSurveyRoutes from './routes/studentSurveyRoutes.js';
import teacherSurveyRoutes from './routes/teacherSurveyRoutes.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// =====================================
// MIDDLEWARES
// =====================================

// CORS - Permitir solicitudes del frontend
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware (desarrollo)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`, {
            body: req.body,
            params: req.params,
            query: req.query
        });
        next();
    });
}

// =====================================
// RUTAS PRINCIPALES
// =====================================

// Ruta de bienvenida
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API de Chatbots Education Survey',
        version: '1.0.0',
        status: 'running',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            studentSurveys: '/api/student-surveys',
            teacherSurveys: '/api/teacher-surveys',
            health: '/api/health'
        },
        documentation: '/api/docs'
    });
});

// Ruta para verificar salud del servidor y BD
app.get('/api/health', async (req, res) => {
    try {
        const dbConnected = await testConnection();
        
        res.json({
            success: true,
            status: 'OK',
            database: dbConnected ? 'conectada' : 'desconectada',
            environment: process.env.NODE_ENV || 'development',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: {
                used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
                total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            status: 'ERROR',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// =====================================
// RUTAS DE LA API
// =====================================

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/student-surveys', studentSurveyRoutes);
app.use('/api/teacher-surveys', teacherSurveyRoutes);

// =====================================
// MANEJO DE ERRORES
// =====================================

// Ruta no encontrada (404)
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Ruta no encontrada: ${req.method} ${req.path}`,
        suggestion: 'Verifica la documentación de la API en /api/docs'
    });
});

// Manejo global de errores
app.use((err, req, res, next) => {
    console.error('Error no manejado:', err);

    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            success: false,
            message: 'JSON inválido en el cuerpo de la solicitud',
            error: err.message
        });
    }

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Error interno del servidor',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// =====================================
// INICIAR SERVIDOR
// =====================================

const startServer = async () => {
    try {
        const dbConnected = await testConnection();
        
        if (!dbConnected) {
            console.warn('Advertencia: Servidor iniciado sin conexión a BD');
            console.warn('Advertencia: Verifica la configuración en el archivo .env');
        }

        const server = app.listen(PORT, () => {
            console.log('\n' + '='.repeat(60));
            console.log('   SERVIDOR CORRIENDO');
            console.log('='.repeat(60));
            console.log(`   Puerto:            ${PORT}`);
            console.log(`   URL:               http://localhost:${PORT}`);
            console.log(`   Base de datos:     ${dbConnected ? 'Conectada' : 'Desconectada'}`);
            console.log(`   Modo:              ${process.env.NODE_ENV || 'development'}`);
            console.log(`   Fecha:             ${new Date().toLocaleString('es-ES')}`);
            console.log('='.repeat(60));
            console.log('\n   Endpoints disponibles:\n');
            console.log('   AUTENTICACION:');
            console.log('    - POST   /api/auth/register      (Registrar usuario)');
            console.log('    - POST   /api/auth/login         (Iniciar sesion)');
            console.log('    - GET    /api/auth/profile       (Obtener perfil)');
            console.log('    - PUT    /api/auth/password      (Cambiar contrasena)');
            console.log('\n   USUARIOS:');
            console.log('    - GET    /api/users              (Listar usuarios - Admin)');
            console.log('    - GET    /api/users/:id          (Obtener usuario)');
            console.log('    - POST   /api/users              (Crear usuario - Admin)');
            console.log('    - PUT    /api/users/:id          (Actualizar usuario)');
            console.log('    - DELETE /api/users/:id          (Eliminar usuario - Admin)');
            console.log('\n   ENCUESTAS ESTUDIANTES:');
            console.log('    - GET    /api/student-surveys    (Listar todas - Admin)');
            console.log('    - GET    /api/student-surveys/my-surveys       (Mis encuestas)');
            console.log('    - GET    /api/student-surveys/statistics       (Estadisticas)');
            console.log('    - GET    /api/student-surveys/my-statistics    (Estadisticas personales)');
            console.log('    - GET    /api/student-surveys/:id              (Ver encuesta)');
            console.log('    - POST   /api/student-surveys                  (Crear encuesta)');
            console.log('    - PUT    /api/student-surveys/:id              (Actualizar)');
            console.log('    - DELETE /api/student-surveys/:id              (Eliminar)');
            console.log('\n   ENCUESTAS PROFESORES:');
            console.log('    - GET    /api/teacher-surveys    (Listar todas - Admin)');
            console.log('    - GET    /api/teacher-surveys/my-surveys       (Mis encuestas)');
            console.log('    - GET    /api/teacher-surveys/statistics       (Estadisticas)');
            console.log('    - GET    /api/teacher-surveys/my-statistics    (Estadisticas personales)');
            console.log('    - GET    /api/teacher-surveys/:id              (Ver encuesta)');
            console.log('    - POST   /api/teacher-surveys                  (Crear)');
            console.log('    - PUT    /api/teacher-surveys/:id              (Actualizar)');
            console.log('    - DELETE /api/teacher-surveys/:id              (Eliminar)');
            console.log('\n   UTILIDADES:');
            console.log('    - GET    /api/health             (Estado del servidor)');
            console.log('\n' + '='.repeat(60) + '\n');
        });

        const gracefulShutdown = async (signal) => {
            console.log(`\nAdvertencia: Senal ${signal} recibida. Cerrando servidor...`);
            
            server.close(async () => {
                console.log('Servidor cerrado correctamente');
                await closePool();
                process.exit(0);
            });

            setTimeout(() => {
                console.error('Error: No se pudo cerrar correctamente. Forzando cierre...');
                process.exit(1);
            }, 10000);
        };

        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

        process.on('unhandledRejection', (err) => {
            console.error('Error no manejado (unhandledRejection):', err);
            gracefulShutdown('unhandledRejection');
        });

        process.on('uncaughtException', (err) => {
            console.error('Excepcion no capturada (uncaughtException):', err);
            gracefulShutdown('uncaughtException');
        });

    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

startServer();

export default app;