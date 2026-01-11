import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Verificar token JWT
export const verifyToken = async (req, res, next) => {
    try {
        // Obtener token del header Authorization
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No se proporcionó token de autenticación'
            });
        }

        // Extraer el token (remover "Bearer ")
        const token = authHeader.substring(7);

        // Verificar y decodificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Buscar el usuario en la base de datos
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no encontrado o token inválido'
            });
        }

        // Agregar información del usuario al request
        req.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        };

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token inválido'
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expirado. Por favor inicia sesión nuevamente'
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Error al verificar token',
            error: error.message
        });
    }
};

// Verificar rol de administrador
export const verifyAdmin = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'No autenticado'
            });
        }

        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Acceso denegado. Se requiere rol de administrador'
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al verificar permisos',
            error: error.message
        });
    }
};

// Verificar rol de profesor (incluye admin)
export const verifyTeacher = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'No autenticado'
            });
        }

        if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Acceso denegado. Se requiere rol de profesor o administrador'
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al verificar permisos',
            error: error.message
        });
    }
};

// Verificar rol de estudiante (incluye admin)
export const verifyStudent = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'No autenticado'
            });
        }

        if (req.user.role !== 'student' && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Acceso denegado. Se requiere rol de estudiante o administrador'
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al verificar permisos',
            error: error.message
        });
    }
};

// Verificar que el usuario accede solo a sus propios recursos
export const verifyOwnership = (paramName = 'userId') => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'No autenticado'
                });
            }

            // Admin puede acceder a todo
            if (req.user.role === 'admin') {
                return next();
            }

            // Obtener el ID del recurso desde los parámetros o el body
            const resourceUserId = parseInt(req.params[paramName] || req.body.user_id);

            // Verificar que el usuario accede solo a sus recursos
            if (req.user.id !== resourceUserId) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permiso para acceder a este recurso'
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error al verificar propiedad del recurso',
                error: error.message
            });
        }
    };
};

// Middleware para verificar que el usuario puede ver/editar una encuesta
export const verifySurveyOwnership = (Model) => {
    return async (req, res, next) => {
        try {
            const surveyId = req.params.id;
            const survey = await Model.findById(surveyId);

            if (!survey) {
                return res.status(404).json({
                    success: false,
                    message: 'Encuesta no encontrada'
                });
            }

            // Admin puede acceder a todo
            if (req.user.role === 'admin') {
                return next();
            }

            // El usuario solo puede acceder a sus propias encuestas
            if (survey.user_id !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permiso para acceder a esta encuesta'
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error al verificar propiedad de la encuesta',
                error: error.message
            });
        }
    };
};

// Middleware opcional: Verificar token pero no fallar si no existe
export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);

            if (user) {
                req.user = {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                };
            }
        }

        next();
    } catch (error) {
        // No fallar, solo continuar sin usuario autenticado
        next();
    }
};

export default {
    verifyToken,
    verifyAdmin,
    verifyTeacher,
    verifyStudent,
    verifyOwnership,
    verifySurveyOwnership,
    optionalAuth
};