// Validar email
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Validar username
export const isValidUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,50}$/;
    return usernameRegex.test(username);
};

// Validar contraseña
export const isValidPassword = (password) => {
    return password && password.length >= 6;
};

// Validar contraseña fuerte
export const isStrongPassword = (password) => {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongRegex.test(password);
};

// Validar rating (1-5)
export const isValidRating = (rating) => {
    const num = parseInt(rating);
    return !isNaN(num) && num >= 1 && num <= 5;
};

// Validar array no vacío
export const isNonEmptyArray = (arr) => {
    return Array.isArray(arr) && arr.length > 0;
};

// Validar formulario de registro
export const validateRegisterForm = (formData) => {
    const errors = {};

    if (!formData.username) {
        errors.username = 'El nombre de usuario es requerido';
    } else if (!isValidUsername(formData.username)) {
        errors.username = 'Username inválido (3-50 caracteres, solo letras, números y _)';
    }

    if (!formData.email) {
        errors.email = 'El email es requerido';
    } else if (!isValidEmail(formData.email)) {
        errors.email = 'Email inválido';
    }

    if (!formData.password) {
        errors.password = 'La contraseña es requerida';
    } else if (!isValidPassword(formData.password)) {
        errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    return errors;
};

// Validar formulario de login
export const validateLoginForm = (formData) => {
    const errors = {};

    if (!formData.email) {
        errors.email = 'El email es requerido';
    } else if (!isValidEmail(formData.email)) {
        errors.email = 'Email inválido';
    }

    if (!formData.password) {
        errors.password = 'La contraseña es requerida';
    }

    if (!formData.role) {
        errors.role = 'Debes seleccionar un tipo de acceso';
    }

    return errors;
};

// Validar encuesta de estudiante
export const validateStudentSurvey = (formData) => {
    const errors = {};

    if (formData.has_used_chatbot === undefined) {
        errors.has_used_chatbot = 'Debes indicar si has usado chatbots';
    }

    if (formData.has_used_chatbot) {
        if (!isNonEmptyArray(formData.chatbots_used)) {
            errors.chatbots_used = 'Selecciona al menos un chatbot';
        }

        if (!isNonEmptyArray(formData.tasks_used_for)) {
            errors.tasks_used_for = 'Selecciona al menos una tarea';
        }

        if (!formData.preferred_chatbot) {
            errors.preferred_chatbot = 'Selecciona tu chatbot preferido';
        }

        if (formData.usefulness_rating && !isValidRating(formData.usefulness_rating)) {
            errors.usefulness_rating = 'Rating inválido (1-5)';
        }

        if (formData.overall_experience && !isValidRating(formData.overall_experience)) {
            errors.overall_experience = 'Rating inválido (1-5)';
        }
    }

    return errors;
};

// Validar encuesta de profesor
export const validateTeacherSurvey = (formData) => {
    const errors = {};

    if (formData.has_used_chatbot === undefined) {
        errors.has_used_chatbot = 'Debes indicar si has usado chatbots';
    }

    if (formData.has_used_chatbot) {
        if (!isNonEmptyArray(formData.chatbots_used)) {
            errors.chatbots_used = 'Selecciona al menos un chatbot';
        }

        if (!isNonEmptyArray(formData.courses_used)) {
            errors.courses_used = 'Selecciona al menos un curso';
        }

        if (!isNonEmptyArray(formData.purposes)) {
            errors.purposes = 'Selecciona al menos un propósito';
        }
    }

    if (!isNonEmptyArray(formData.countries)) {
        errors.countries = 'Debes seleccionar al menos un país';
    }

    return errors;
};