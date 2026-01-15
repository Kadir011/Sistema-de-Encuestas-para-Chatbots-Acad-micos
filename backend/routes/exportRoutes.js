import express from 'express';
import {
    exportStudentSurveys,
    exportTeacherSurveys,
    exportStatistics
} from '../controllers/exportController.js';
import { verifyToken, verifyAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación de administrador
router.use(verifyToken);
router.use(verifyAdmin);

// Exportar encuestas de estudiantes
router.get('/student-surveys', exportStudentSurveys);

// Exportar encuestas de profesores
router.get('/teacher-surveys', exportTeacherSurveys);

// Exportar estadísticas generales
router.get('/statistics', exportStatistics);

export default router;