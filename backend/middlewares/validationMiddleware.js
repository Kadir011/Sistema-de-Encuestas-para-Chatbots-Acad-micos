// Validar datos de registro
export const validateRegister = (req, res, next) => {
    try {
        const { username, email, password, role } = req.body;

        const errors = [];

        // Validar username
        if (!username) {
            errors.push('El nombre de usuario es requerido');
        } else if (username.length < 3 || username.length > 50) {
            errors.push('El nombre de usuario debe tener entre 3 y 50 caracteres');
        } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            errors.push('El nombre de usuario solo puede contener letras, números y guiones bajos');
        }

        // Validar email
        if (!email) {
            errors.push('El correo electrónico es requerido');
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                errors.push('El correo electrónico no es válido');
            }
        }

        // Validar contraseña
        if (!password) {
            errors.push('La contraseña es requerida');
        } else if (password.length < 6) {
            errors.push('La contraseña debe tener al menos 6 caracteres');
        }

        // Validar rol
        const validRoles = ['student', 'teacher', 'admin'];
        if (role && !validRoles.includes(role)) {
            errors.push('Rol inválido. Debe ser: student, teacher o admin');
        }

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Errores de validación',
                errors
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error en validación',
            error: error.message
        });
    }
};

// Validar datos de login
export const validateLogin = (req, res, next) => {
    try {
        const { email, password, role } = req.body;
        const errors = [];

        if (!email) {
            errors.push('El correo electrónico es requerido');
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                errors.push('El correo electrónico no es válido');
            }
        }

        if (!password) {
            errors.push('La contraseña es requerida');
        }

        if (!role) {
            errors.push('El rol es requerido para iniciar sesión');
        }

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Errores de validación',
                errors
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error en validación',
            error: error.message
        });
    }
};

// Validar actualización de usuario
export const validateUserUpdate = (req, res, next) => {
    try {
        const { username, email, role } = req.body;

        const errors = [];

        // Al menos un campo debe ser proporcionado
        if (!username && !email && !role) {
            errors.push('Debe proporcionar al menos un campo para actualizar');
        }

        // Validar username si se proporciona
        if (username !== undefined) {
            if (username.length < 3 || username.length > 50) {
                errors.push('El nombre de usuario debe tener entre 3 y 50 caracteres');
            } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
                errors.push('El nombre de usuario solo puede contener letras, números y guiones bajos');
            }
        }

        // Validar email si se proporciona
        if (email !== undefined) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                errors.push('El correo electrónico no es válido');
            }
        }

        // Validar rol si se proporciona
        if (role !== undefined) {
            const validRoles = ['student', 'teacher', 'admin'];
            if (!validRoles.includes(role)) {
                errors.push('Rol inválido. Debe ser: student, teacher o admin');
            }
        }

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Errores de validación',
                errors
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error en validación',
            error: error.message
        });
    }
};

// Validar encuesta de estudiante
export const validateStudentSurvey = (req, res, next) => {
    try {
        const {
            has_used_chatbot,
            chatbots_used,
            usefulness_rating,
            overall_experience,
            tasks_used_for,
            preferred_chatbot
        } = req.body;

        const errors = [];

        // Validar has_used_chatbot
        if (has_used_chatbot === undefined) {
            errors.push('Debe indicar si ha usado chatbots');
        }

        // Si ha usado chatbots, validar campos relacionados
        if (has_used_chatbot === true) {
            if (!chatbots_used || chatbots_used.length === 0) {
                errors.push('Debe seleccionar al menos un chatbot usado');
            }

            if (!tasks_used_for || tasks_used_for.length === 0) {
                errors.push('Debe seleccionar al menos una tarea');
            }

            if (!preferred_chatbot) {
                errors.push('Debe seleccionar un chatbot preferido');
            }
        }

        // Validar ratings si se proporcionan
        if (usefulness_rating !== undefined) {
            if (usefulness_rating < 1 || usefulness_rating > 5) {
                errors.push('La calificación de utilidad debe estar entre 1 y 5');
            }
        }

        if (overall_experience !== undefined) {
            if (overall_experience < 1 || overall_experience > 5) {
                errors.push('La calificación de experiencia debe estar entre 1 y 5');
            }
        }

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Errores de validación',
                errors
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error en validación',
            error: error.message
        });
    }
};

// Validar encuesta de profesor
export const validateTeacherSurvey = (req, res, next) => {
    try {
        const {
            has_used_chatbot,
            chatbots_used,
            courses_used,
            purposes,
            country
        } = req.body;

        const errors = [];

        // Validar has_used_chatbot
        if (has_used_chatbot === undefined) {
            errors.push('Debe indicar si ha usado chatbots');
        }

        // Si ha usado chatbots, validar campos relacionados
        if (has_used_chatbot === true) {
            if (!chatbots_used || chatbots_used.length === 0) {
                errors.push('Debe seleccionar al menos un chatbot usado');
            }

            if (!courses_used || courses_used.length === 0) {
                errors.push('Debe seleccionar al menos un curso');
            }

            if (!purposes || purposes.length === 0) {
                errors.push('Debe seleccionar al menos un propósito');
            }
        }

        // País es requerido
        if (!country) {
            errors.push('El país es requerido');
        }

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Errores de validación',
                errors
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error en validación',
            error: error.message
        });
    }
};

// Middleware de sanitización para prevenir XSS
export const sanitizeInput = (req, res, next) => {
    try {
        const sanitize = (obj) => {
            for (let key in obj) {
                if (typeof obj[key] === 'string') {
                    // Remover tags HTML básicos
                    obj[key] = obj[key].replace(/<script.*?>.*?<\/script>/gi, '');
                    obj[key] = obj[key].replace(/<.*?>/g, '');
                } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                    sanitize(obj[key]);
                }
            }
        };

        if (req.body) {
            sanitize(req.body);
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al sanitizar entrada',
            error: error.message
        });
    }
};

export default {
    validateRegister,
    validateLogin,
    validateUserUpdate,
    validateStudentSurvey,
    validateTeacherSurvey,
    sanitizeInput
};