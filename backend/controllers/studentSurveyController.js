import StudentSurvey from '../models/StudentSurvey.js';

export const createStudentSurvey = async (req, res)  => {
    try {
        const surveyData = {
            user_id: req.user.id,
            ...req.body
        }

        const newSurvey = await StudentSurvey.create(surveyData);
        res.status(201).json({
            success: true,
            message: 'Encuesta realizada exitosamente',
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

export const getAllStudentSurveys = async (req, res) => {
    try {
        const surveys = await StudentSurvey.findAll();
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

export const getStudentSurveyById = async (req, res) => {
    try {
        const { id } = req.params;
        const survey = await StudentSurvey.findById(id);

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
            message: 'Error al obtener encuesta por ID',
            error: error.message
        })
    }
}

export const getMyStudentSurveys = async (req, res) => {
    try {
        const userId = req.user.id;
        const surveys = await StudentSurvey.findByUserId(userId);
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

export const updateStudentSurvey = async (req, res) => {
    try {
        const { id } = req.params;
        const survey = await StudentSurvey.findById(id);

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

        const updatedSurvey = await StudentSurvey.update(id, req.body);
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

export const deleteStudentSurvey = async (req, res) => {
    try {
        const { id } = req.params;
        const survey = await StudentSurvey.findById(id);

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

        await StudentSurvey.delete(id);
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

export const getStudentSurveyStatistics = async (req, res) => {
    try {
        // Si es un usuario normal, obtener solo SUS estadísticas
        if (req.user.role !== 'admin') {
            const userStats = await StudentSurvey.getUserStatistics(req.user.id);
            const userSurveys = await StudentSurvey.findByUserId(req.user.id);

            // Calcular estadísticas personalizadas
            const chatbotsUsed = new Set();
            const tasksUsed = new Set();
            
            userSurveys.forEach(survey => {
                if (survey.chatbots_used) {
                    survey.chatbots_used.forEach(chatbot => chatbotsUsed.add(chatbot));
                }
                if (survey.tasks_used_for) {
                    survey.tasks_used_for.forEach(task => tasksUsed.add(task));
                }
            });

            return res.json({
                success: true,
                message: 'Tus estadísticas obtenidas exitosamente',
                statistics: {
                    ...userStats,
                    unique_chatbots: chatbotsUsed.size,
                    unique_tasks: tasksUsed.size,
                    chatbots_list: Array.from(chatbotsUsed),
                    tasks_list: Array.from(tasksUsed)
                }
            });
        }

        // Si es admin, obtener estadísticas globales
        const statistics = await StudentSurvey.getStatistics();
        const mostUsedChatbots = await StudentSurvey.getMostUsedChatbots();
        const mostCommonTasks = await StudentSurvey.getMostCommonTasks();
        const frequencyDistribution = await StudentSurvey.getUsageFrequencyDistribution();

        res.json({
            success: true,
            message: 'Estadísticas obtenidas exitosamente',
            statistics: {
                ...statistics,
                most_used_chatbots: mostUsedChatbots,
                most_common_tasks: mostCommonTasks,
                frequency_distribution: frequencyDistribution
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener estadísticas',
            error: error.message
        });
    }
};

export const getMyStatistics = async (req, res) => {
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
            message: 'Error al obtener tus estadísticas',
            error: error.message
        });
    }
};

export default {
    createStudentSurvey,
    getAllStudentSurveys,
    getStudentSurveyById,
    getMyStudentSurveys,
    updateStudentSurvey,
    deleteStudentSurvey,
    getStudentSurveyStatistics,
    getMyStatistics
};