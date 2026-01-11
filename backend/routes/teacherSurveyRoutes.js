import express from 'express';
import {
    createTeacherSurvey,
    getAllTeacherSurveys,
    getTeacherSurveyById,
    getMyTeacherSurveys,
    updateTeacherSurvey,
    deleteTeacherSurvey,
    getTeacherSurveyStatistics,
    getMyStatistics
} from '../controllers/teacherSurveyController.js';
import { 
    verifyToken, 
    verifyAdmin, 
    verifyTeacher 
} from '../middlewares/authMiddleware.js';
import { 
    validateTeacherSurvey, 
    sanitizeInput 
} from '../middlewares/validationMiddleware.js';

const router = express.Router();
router.use(verifyToken);

// =====================================
// RUTAS PARA PROFESORES Y ADMIN
// =====================================
router.post('/', verifyTeacher, sanitizeInput, validateTeacherSurvey, createTeacherSurvey);
router.get('/my-surveys', verifyTeacher, getMyTeacherSurveys);
router.get('/statistics', getTeacherSurveyStatistics);
router.get('/my-statistics', getMyStatistics);
router.get('/:id', getTeacherSurveyById);
router.put('/:id', sanitizeInput, validateTeacherSurvey, updateTeacherSurvey);
router.delete('/:id', deleteTeacherSurvey);

// =====================================
// RUTAS SOLO PARA ADMIN
// =====================================
router.get('/', verifyAdmin, getAllTeacherSurveys);

export default router;