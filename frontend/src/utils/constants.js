// Roles de Usuario
export const ROLES = {
    STUDENT: 'student',
    TEACHER: 'teacher',
    ADMIN: 'admin'
}

// Opciones de chatbots
export const CHATBOTS = [
    'ChatGPT',
    'Claude',
    'Gemini',
    'Copilot',
    'Perplexity',
    'Meta AI',
    'Grok',
    'Otro',
];

// Frecuencia de uso
export const USAGE_FREQUENCY = [
    'Muy frecuentemente (diariamente)',
    'Frecuentemente (varias veces por semana)',
    'Ocasionalmente (una vez por semana)',
    'Casi nunca (una vez al mes o menos)',
    'Nunca',
];

// Tareas para estudiantes
export const STUDENT_TASKS = [
    'Resolver dudas académicas',
    'Ayuda con tareas y deberes',
    'Preparación para exámenes',
    'Aprender nuevos conceptos',
    'Traducción de textos',
    'Corrección de ortografía y gramática',
    'Generación de ideas para proyectos',
    'Resúmenes de textos',
    'Práctica de idiomas',
    'Programación/código',
    'Otro',
];

// Comparación de efectividad
export const EFFECTIVENESS_COMPARISON = [
    'Mucho más útil que buscar en Google',
    'Algo más útil que buscar en Google',
    'Igual de útil que buscar en Google',
    'Menos útil que buscar en Google',
    'No estoy seguro',
];

// Propósitos para profesores
export const TEACHER_PURPOSES = [
    'Preparación de materiales didácticos',
    'Creación de actividades y ejercicios',
    'Evaluación y retroalimentación',
    'Planificación de clases',
    'Investigación educativa',
    'Comunicación con estudiantes',
    'Desarrollo profesional',
    'Otro',
];

// Resultados para profesores
export const TEACHER_OUTCOMES = [
    'Mayor eficiencia en la preparación de clases',
    'Mejora en la calidad de materiales',
    'Más tiempo para atención personalizada',
    'Mayor creatividad en actividades',
    'Mejor comprensión de conceptos complejos',
    'Actualización de conocimientos',
    'Otro',
];

// Desafíos para profesores
export const TEACHER_CHALLENGES = [
    'Precisión de la información',
    'Plagio por parte de estudiantes',
    'Dependencia excesiva de la tecnología',
    'Falta de capacitación',
    'Preocupaciones éticas',
    'Limitaciones técnicas',
    'Costo de acceso',
    'Otro',
];

// Probabilidad de uso futuro
export const FUTURE_USE_LIKELIHOOD = [
    'Muy probable',
    'Probable',
    'Neutral',
    'Poco probable',
    'Imposible',
];

// Ventajas para profesores
export const TEACHER_ADVANTAGES = [
    'Ahorro de tiempo',
    'Acceso a información actualizada',
    'Personalización del aprendizaje',
    'Desarrollo de pensamiento crítico',
    'Innovación pedagógica',
    'Inclusión educativa',
    'Otro',
];

// Preocupaciones para profesores
export const TEACHER_CONCERNS = [
    'Veracidad de la información',
    'Uso inadecuado por estudiantes',
    'Pérdida de habilidades básicas',
    'Privacidad de datos',
    'Desigualdad en el acceso',
    'Sustitución del docente',
    'Otro',
];

// Recursos necesarios para profesores
export const RESOURCES_NEEDED = [
    'Guías de uso pedagógico',
    'Formación técnica',
    'Ejemplos de mejores prácticas',
    'Herramientas de detección de plagio',
    'Políticas institucionales claras',
    'Soporte técnico',
    'Otro',
];

// Rangos de edad (profesores)
export const AGE_RANGES = [
    'Menos de 25 años',
    '25-35 años',
    '36-45 años',
    '46-55 años',
    'Más de 55 años',
];

// Tipos de institución
export const INSTITUTION_TYPES = [
    'Escuela primaria',
    'Escuela secundaria',
    'Preparatoria/Bachillerato',
    'Universidad',
    'Instituto técnico',
    'Centro de formación',
    'Educación en línea',
    'Otro',
];

// Años de experiencia docente
export const YEARS_EXPERIENCE = [
    'Menos de 1 año',
    '1-5 años',
    '6-10 años',
    '11-20 años',
    'Más de 20 años',
];

// Estados de la aplicación
export const APP_STATUS = {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCESS: 'success',
    ERROR: 'error',
};

// Mensajes de error comunes
export const ERROR_MESSAGES = {
    NETWORK: 'Error de conexión. Verifica tu internet.',
    UNAUTHORIZED: 'No estás autorizado. Inicia sesión nuevamente.',
    FORBIDDEN: 'No tienes permisos para realizar esta acción.',
    NOT_FOUND: 'Recurso no encontrado.',
    SERVER: 'Error del servidor. Intenta más tarde.',
    VALIDATION: 'Por favor verifica los datos ingresados.',
};

// Mensajes de éxito
export const SUCCESS_MESSAGES = {
    LOGIN: 'Inicio de sesión exitoso',
    REGISTER: 'Registro exitoso',
    SURVEY_CREATED: 'Encuesta creada exitosamente',
    SURVEY_UPDATED: 'Encuesta actualizada exitosamente',
    SURVEY_DELETED: 'Encuesta eliminada exitosamente',
    PASSWORD_UPDATED: 'Contraseña actualizada exitosamente',
};