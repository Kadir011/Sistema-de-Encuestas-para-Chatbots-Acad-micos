import express from 'express';
import { 
    register, 
    login, 
    getProfile, 
    updatePassword, 
    logout 
} from '../controllers/authController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { 
    validateRegister, 
    validateLogin, 
    sanitizeInput 
} from '../middlewares/validationMiddleware.js';

const router = express.Router();

// =====================================
// RUTAS PÚBLICAS
// =====================================
router.post('/register', sanitizeInput, validateRegister, register);
router.post('/login', sanitizeInput, validateLogin, login);

// =====================================
// RUTAS PROTEGIDAS (requieren token)
// =====================================
router.get('/profile', verifyToken, getProfile);
router.put('/password', verifyToken, sanitizeInput, updatePassword);
router.post('/logout', verifyToken, logout);

export default router;