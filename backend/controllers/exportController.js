import StudentSurvey from '../models/StudentSurvey.js';
import TeacherSurvey from '../models/TeacherSurvey.js';

export const exportStudentSurveys = async (req, res) => {
    try {
        const { startDate, endDate, hasExperience } = req.query;
        
        let surveys = await StudentSurvey.findAll();
        
        // Aplicar filtros
        if (startDate) {
            surveys = surveys.filter(s => new Date(s.created_at) >= new Date(startDate));
        }
        
        if (endDate) {
            surveys = surveys.filter(s => new Date(s.created_at) <= new Date(endDate));
        }
        
        if (hasExperience !== undefined) {
            const experienceFilter = hasExperience === 'true';
            surveys = surveys.filter(s => s.has_used_chatbot === experienceFilter);
        }
        
        // Preparar datos para Excel
        const excelData = surveys.map(survey => ({
            'ID': survey.id,
            'Usuario': survey.username,
            'Email': survey.email,
            'Ha Usado Chatbot': survey.has_used_chatbot ? 'Sí' : 'No',
            'Chatbots Usados': Array.isArray(survey.chatbots_used) 
                ? survey.chatbots_used.join(', ') 
                : survey.chatbots_used || 'N/A',
            'Frecuencia de Uso': survey.usage_frequency || 'N/A',
            'Calificación Utilidad': survey.usefulness_rating || 'N/A',
            'Tareas': Array.isArray(survey.tasks_used_for) 
                ? survey.tasks_used_for.join(', ') 
                : survey.tasks_used_for || 'N/A',
            'Experiencia General': survey.overall_experience || 'N/A',
            'Chatbot Preferido': survey.preferred_chatbot || 'N/A',
            'Comparación con Google': survey.effectiveness_comparison || 'N/A',
            'Continuará Usando': survey.will_continue_using ? 'Sí' : 'No',
            'Recomendaría': survey.would_recommend ? 'Sí' : 'No',
            'Comentarios': survey.additional_comments || '',
            'Fecha de Creación': new Date(survey.created_at).toLocaleDateString('es-ES')
        }));
        
        res.json({
            success: true,
            data: excelData,
            count: excelData.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al exportar encuestas de estudiantes',
            error: error.message
        });
    }
};

export const exportTeacherSurveys = async (req, res) => {
    try {
        const { startDate, endDate, hasExperience, country } = req.query;
        
        let surveys = await TeacherSurvey.findAll();
        
        // Aplicar filtros
        if (startDate) {
            surveys = surveys.filter(s => new Date(s.created_at) >= new Date(startDate));
        }
        
        if (endDate) {
            surveys = surveys.filter(s => new Date(s.created_at) <= new Date(endDate));
        }
        
        if (hasExperience !== undefined) {
            const experienceFilter = hasExperience === 'true';
            surveys = surveys.filter(s => s.has_used_chatbot === experienceFilter);
        }
        
        if (country) {
            surveys = surveys.filter(s => 
                s.country && s.country.toLowerCase().includes(country.toLowerCase())
            );
        }
        
        // Preparar datos para Excel
        const excelData = surveys.map(survey => ({
            'ID': survey.id,
            'Usuario': survey.username,
            'Email': survey.email,
            'Ha Usado Chatbot': survey.has_used_chatbot ? 'Sí' : 'No',
            'Chatbots Usados': Array.isArray(survey.chatbots_used) 
                ? survey.chatbots_used.join(', ') 
                : survey.chatbots_used || 'N/A',
            'Cursos': Array.isArray(survey.courses_used) 
                ? survey.courses_used.join(', ') 
                : survey.courses_used || 'N/A',
            'Propósitos': Array.isArray(survey.purposes) 
                ? survey.purposes.join(', ') 
                : survey.purposes || 'N/A',
            'Resultados': Array.isArray(survey.outcomes) 
                ? survey.outcomes.join(', ') 
                : survey.outcomes || 'N/A',
            'Desafíos': Array.isArray(survey.challenges) 
                ? survey.challenges.join(', ') 
                : survey.challenges || 'N/A',
            'Probabilidad Uso Futuro': survey.likelihood_future_use || 'N/A',
            'Ventajas': Array.isArray(survey.advantages) 
                ? survey.advantages.join(', ') 
                : survey.advantages || 'N/A',
            'Preocupaciones': Array.isArray(survey.concerns) 
                ? survey.concerns.join(', ') 
                : survey.concerns || 'N/A',
            'Recursos Necesarios': Array.isArray(survey.resources_needed) 
                ? survey.resources_needed.join(', ') 
                : survey.resources_needed || 'N/A',
            'Recomendaría': survey.would_recommend ? 'Sí' : 'No',
            'Rango de Edad': survey.age_range || 'N/A',
            'Tipo de Institución': survey.institution_type || 'N/A',
            'País': survey.country || 'N/A',
            'Años de Experiencia': survey.years_experience || 'N/A',
            'Comentarios': survey.additional_comments || '',
            'Fecha de Creación': new Date(survey.created_at).toLocaleDateString('es-ES')
        }));
        
        res.json({
            success: true,
            data: excelData,
            count: excelData.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al exportar encuestas de profesores',
            error: error.message
        });
    }
};

export const exportStatistics = async (req, res) => {
    try {
        const { type } = req.query; // 'student' o 'teacher'
        
        let statistics = {};
        
        if (type === 'student' || !type) {
            const studentStats = await StudentSurvey.getStatistics();
            const mostUsedChatbots = await StudentSurvey.getMostUsedChatbots();
            const mostCommonTasks = await StudentSurvey.getMostCommonTasks();
            const frequencyDistribution = await StudentSurvey.getUsageFrequencyDistribution();
            
            statistics.student = {
                general: studentStats,
                chatbots: mostUsedChatbots,
                tasks: mostCommonTasks,
                frequency: frequencyDistribution
            };
        }
        
        if (type === 'teacher' || !type) {
            const teacherStats = await TeacherSurvey.getStatistics();
            const countryDist = await TeacherSurvey.getCountryDistribution();
            const institutionDist = await TeacherSurvey.getInstitutionDistribution();
            const commonPurposes = await TeacherSurvey.getMostCommonPurposes();
            const commonChallenges = await TeacherSurvey.getMostCommonChallenges();
            
            statistics.teacher = {
                general: teacherStats,
                countries: countryDist,
                institutions: institutionDist,
                purposes: commonPurposes,
                challenges: commonChallenges
            };
        }
        
        res.json({
            success: true,
            statistics
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al exportar estadísticas',
            error: error.message
        });
    }
};

export default {
    exportStudentSurveys,
    exportTeacherSurveys,
    exportStatistics
};