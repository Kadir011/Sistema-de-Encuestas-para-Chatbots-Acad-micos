import express from 'express';
import {
    createStudentSurvey,
    getAllStudentSurveys,
    getStudentSurveyById,
    getMyStudentSurveys,
    updateStudentSurvey,
    deleteStudentSurvey,
    getStudentSurveyStatistics,
    getMyStatistics
} from '../controllers/studentSurveyController.js';
import { verifyToken, verifyAdmin } from '../middlewares/authMiddleware.js';
import { validateStudentSurvey, sanitizeInput } from '../middlewares/validationMiddleware.js';

const router = express.Router();

// =====================================
// TODAS LAS RUTAS REQUIEREN AUTENTICACIÓN
// =====================================
router.use(verifyToken);

// =====================================
// RUTAS PARA USUARIOS AUTENTICADOS
// =====================================
router.post('/', sanitizeInput, validateStudentSurvey, createStudentSurvey);
router.get('/my-surveys', getMyStudentSurveys);
router.get('/statistics', getStudentSurveyStatistics);
router.get('/my-statistics', getMyStatistics);
router.get('/:id', getStudentSurveyById);
router.put('/:id', sanitizeInput, validateStudentSurvey, updateStudentSurvey);
router.delete('/:id', deleteStudentSurvey);

// =====================================
// RUTAS SOLO PARA ADMIN
// =====================================
router.get('/', verifyAdmin, getAllStudentSurveys);

export default router;