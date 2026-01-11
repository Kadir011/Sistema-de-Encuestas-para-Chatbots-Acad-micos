import TeacherSurvey from '../models/TeacherSurvey.js';

export const createTeacherSurvey = async (req, res) => {
    try {
        const surveyData = {
            user_id: req.user.id,
            ...req.body
        }

        const newSurvey = await TeacherSurvey.create(surveyData);
        res.status(201).json({
            success: true,
            message: 'Encuesta creada exitosamente',
            survey: newSurvey
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear encuesta',
            error: error.message
        });
    }
}

export const getAllTeacherSurveys = async (req, res) => {
    try {
        const surveys = await TeacherSurvey.findAll();
        res.status(201).json({
            success: true,
            message: 'Encuestas obtenidas exitosamente',
            count: surveys.length,
            surveys
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener encuestas',
            error: error.message
        });
    }
}

export const getTeacherSurveyById = async (req, res) => {
    try {
        const { id } = req.params;
        const survey = await TeacherSurvey.findById(id);

        // Si no existe la encuesta
        if (!survey) {
            return res.status(404).json({
                success: false,
                message: 'Encuesta no encontrada'
            });
        }

        // Verificar que el usuario puede ver esta encuesta
        if (survey.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para ver esta encuesta'
            });
        }

        res.status(201).json({
            success: true,
            message: 'Encuesta obtenida exitosamente',
            survey
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener encuesta',
            error: error.message
        });
    }
}

export const getMyTeacherSurveys = async (req, res) => {
    try {
        const userId = req.user.id;
        const surveys = await TeacherSurvey.findByUserId(userId);
        res.status(201).json({
            success: true,
            message: 'Encuestas obtenidas exitosamente',
            count: surveys.length,
            surveys
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener mis encuestas',
            error: error.message
        });
    }
}

export const updateTeacherSurvey = async (req, res) => {
    try {
        const { id } = req.params;
        const survey = await TeacherSurvey.findById(id);

        // Si no existe la encuesta
        if (!survey) {
            return res.status(404).json({
                success: false,
                message: 'Encuesta no encontrada'
            });
        }

        // Verificar permisos: solo el propietario o admin pueden actualizar
        if (survey.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para editar esta encuesta'
            });
        }

        const updatedSurvey = await TeacherSurvey.update(id, req.body);
        res.status(201).json({
            success: true,
            message: 'Encuesta actualizada exitosamente',
            survey: updatedSurvey
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar encuesta',
            error: error.message
        });
    }
}

export const deleteTeacherSurvey = async (req, res) => {
    try {
        const { id } = req.params;
        const survey = await TeacherSurvey.findById(id);

        // Si no existe la encuesta
        if (!survey) {
            return res.status(404).json({
                success: false,
                message: 'Encuesta no encontrada'
            });
        }

        // Verificar permisos: solo el propietario o admin pueden eliminar
        if (survey.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para eliminar esta encuesta'
            });
        }

        await TeacherSurvey.delete(id);
        res.status(201).json({
            success: true,
            message: 'Encuesta eliminada exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar encuesta',
            error: error.message
        });
    }
}

export const getTeacherSurveyStatistics = async (req, res) => {
    try {
        const userStats = await StudentSurvey.getUserStatistics(req.user.id);
        const userSurveys = await StudentSurvey.findByUserId(req.user.id);

        // Calcular estadísticas detalladas
        const chatbotsUsed = new Set();
        const tasksUsed = new Set();
        const chatbotCounts = {};
        const taskCounts = {};
        
        userSurveys.forEach(survey => {
            if (survey.chatbots_used) {
                survey.chatbots_used.forEach(chatbot => {
                    chatbotsUsed.add(chatbot);
                    chatbotCounts[chatbot] = (chatbotCounts[chatbot] || 0) + 1;
                });
            }
            if (survey.tasks_used_for) {
                survey.tasks_used_for.forEach(task => {
                    tasksUsed.add(task);
                    taskCounts[task] = (taskCounts[task] || 0) + 1;
                });
            }
        });

        res.json({
            success: true,
            message: 'Tus estadísticas personales obtenidas exitosamente',
            statistics: {
                ...userStats,
                unique_chatbots: chatbotsUsed.size,
                unique_tasks: tasksUsed.size,
                chatbots_usage: chatbotCounts,
                tasks_usage: taskCounts,
                surveys: userSurveys
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener estadísticas',
            error: error.message
        });
    }
}

export const getMyStatistics = async(req, res) => {
    try {
        const userStats = await TeacherSurvey.getUserStatistics(req.user.id);
        const userSurveys = await TeacherSurvey.findByUserId(req.user.id);

        // Calcular estadísticas detalladas
        const chatbotsUsed = new Set();
        const tasksUsed = new Set();
        const chatbotCounts = {};
        const taskCounts = {};
        
        userSurveys.forEach(survey => {
            if (survey.chatbots_used) {
                survey.chatbots_used.forEach(chatbot => {
                    chatbotsUsed.add(chatbot);
                    chatbotCounts[chatbot] = (chatbotCounts[chatbot] || 0) + 1;
                });
            }
            if (survey.tasks_used_for) {
                survey.tasks_used_for.forEach(task => {
                    tasksUsed.add(task);
                    taskCounts[task] = (taskCounts[task] || 0) + 1;
                });
            }
        });

        res.json({
            success: true,
            message: 'Tus estadísticas personales obtenidas exitosamente',
            statistics: {
                ...userStats,
                unique_chatbots: chatbotsUsed.size,
                unique_tasks: tasksUsed.size,
                chatbots_usage: chatbotCounts,
                tasks_usage: taskCounts,
                surveys: userSurveys
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener tus estadísticas',
            error: error.message
        });
    }
}

export default {
    createTeacherSurvey,
    getAllTeacherSurveys,
    getTeacherSurveyById,
    getMyTeacherSurveys,
    updateTeacherSurvey,
    deleteTeacherSurvey,
    getTeacherSurveyStatistics,
    getMyStatistics
}