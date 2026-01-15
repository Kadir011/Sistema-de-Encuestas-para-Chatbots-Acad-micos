import { query } from '../config/database.js';

class TeacherSurvey {
    // Crear nueva encuesta de profesor
    static async create(surveyData) {
        try {
            const text = `
                INSERT INTO teacher_surveys (
                    user_id, has_used_chatbot, chatbots_used, courses_used,
                    purposes, outcomes, challenges, likelihood_future_use,
                    advantages, concerns, resources_needed, would_recommend,
                    age_range, institution_type, country, years_experience, additional_comments
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
                RETURNING *
            `;

            const values = [
                surveyData.user_id,
                surveyData.has_used_chatbot,
                surveyData.chatbots_used || [],
                surveyData.courses_used || [],
                surveyData.purposes || [],
                surveyData.outcomes || [],
                surveyData.challenges || [],
                surveyData.likelihood_future_use,
                surveyData.advantages || [],
                surveyData.concerns || [],
                surveyData.resources_needed || [],
                surveyData.would_recommend,
                surveyData.age_range,
                surveyData.institution_type,
                surveyData.country,
                surveyData.years_experience,
                surveyData.additional_comments
            ];

            const result = await query(text, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error al crear encuesta de profesor: ${error.message}`);
        }
    }

    // Obtener todas las encuestas con información de usuario
    static async findAll() {
        try {
            const text = `
                SELECT 
                    t.*,
                    u.username,
                    u.email,
                    u.role
                FROM teacher_surveys t
                JOIN users u ON t.user_id = u.id
                ORDER BY t.created_at DESC
            `;
            const result = await query(text);
            return result.rows;
        } catch (error) {
            throw new Error(`Error al obtener encuestas: ${error.message}`);
        }
    }

    // Obtener encuesta por ID con información de usuario
    static async findById(id) {
        try {
            const text = `
                SELECT 
                    t.*,
                    u.username,
                    u.email,
                    u.role
                FROM teacher_surveys t
                JOIN users u ON t.user_id = u.id
                WHERE t.id = $1
            `;
            const result = await query(text, [id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error al obtener encuesta: ${error.message}`);
        }
    }

    // Obtener encuestas por usuario
    static async findByUserId(userId) {
        try {
            const text = `
                SELECT 
                    t.*,
                    u.username,
                    u.email,
                    u.role
                FROM teacher_surveys t
                JOIN users u ON t.user_id = u.id
                WHERE t.user_id = $1
                ORDER BY t.created_at DESC
            `;
            const result = await query(text, [userId]);
            return result.rows;
        } catch (error) {
            throw new Error(`Error al obtener encuestas del usuario: ${error.message}`);
        }
    }

    // Actualizar encuesta
    static async update(id, surveyData) {
        try {
            const text = `
                UPDATE teacher_surveys 
                SET 
                    has_used_chatbot = COALESCE($1, has_used_chatbot),
                    chatbots_used = COALESCE($2, chatbots_used),
                    courses_used = COALESCE($3, courses_used),
                    purposes = COALESCE($4, purposes),
                    outcomes = COALESCE($5, outcomes),
                    challenges = COALESCE($6, challenges),
                    likelihood_future_use = COALESCE($7, likelihood_future_use),
                    advantages = COALESCE($8, advantages),
                    concerns = COALESCE($9, concerns),
                    resources_needed = COALESCE($10, resources_needed),
                    would_recommend = COALESCE($11, would_recommend),
                    age_range = COALESCE($12, age_range),
                    institution_type = COALESCE($13, institution_type),
                    country = COALESCE($14, country),
                    years_experience = COALESCE($15, years_experience),
                    additional_comments = COALESCE($16, additional_comments)
                WHERE id = $17
                RETURNING *
            `;

            const values = [
                surveyData.has_used_chatbot,
                surveyData.chatbots_used,
                surveyData.courses_used,
                surveyData.purposes,
                surveyData.outcomes,
                surveyData.challenges,
                surveyData.likelihood_future_use,
                surveyData.advantages,
                surveyData.concerns,
                surveyData.resources_needed,
                surveyData.would_recommend,
                surveyData.age_range,
                surveyData.institution_type,
                surveyData.country,
                surveyData.years_experience,
                surveyData.additional_comments,
                id
            ];

            const result = await query(text, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error al actualizar encuesta: ${error.message}`);
        }
    }

    // Eliminar encuesta
    static async delete(id) {
        try {
            const text = 'DELETE FROM teacher_surveys WHERE id = $1 RETURNING id';
            const result = await query(text, [id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error al eliminar encuesta: ${error.message}`);
        }
    }

    // Obtener estadísticas generales
    static async getStatistics() {
        try {
            const text = `
                SELECT 
                    COUNT(*) as total_surveys,
                    COUNT(CASE WHEN has_used_chatbot = true THEN 1 END) as teachers_using_chatbots,
                    COUNT(CASE WHEN likelihood_future_use = 'Muy probable' THEN 1 END) as very_likely_continue,
                    COUNT(CASE WHEN likelihood_future_use = 'Probable' THEN 1 END) as likely_continue,
                    COUNT(CASE WHEN likelihood_future_use = 'Imposible' THEN 1 END) as unlikely_continue,
                    COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as new_this_week,
                    COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as new_this_month
                FROM teacher_surveys
            `;
            const result = await query(text);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error al obtener estadísticas: ${error.message}`);
        }
    }

    // Obtener estadísticas por usuario
    static async getUserStatistics(userId) {
        try {
            const text = `
                SELECT 
                    COUNT(*) as total_surveys,
                    COUNT(CASE WHEN has_used_chatbot = true THEN 1 END) as used_chatbot_count,
                    MAX(created_at) as last_survey_date,
                    MIN(created_at) as first_survey_date,
                    likelihood_future_use as current_likelihood
                FROM teacher_surveys
                WHERE user_id = $1
                GROUP BY likelihood_future_use
                ORDER BY created_at DESC
                LIMIT 1
            `;
            const result = await query(text, [userId]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error al obtener estadísticas del usuario: ${error.message}`);
        }
    }

    // Obtener distribución por país
    static async getCountryDistribution() {
        try {
            const text = `
                SELECT 
                    country,
                    COUNT(*) as count
                FROM teacher_surveys
                WHERE country IS NOT NULL
                GROUP BY country
                ORDER BY count DESC
            `;
            const result = await query(text);
            return result.rows;
        } catch (error) {
            throw new Error(`Error al obtener distribución por país: ${error.message}`);
        }
    }

    // Obtener distribución por tipo de institución
    static async getInstitutionDistribution() {
        try {
            const text = `
                SELECT 
                    institution_type,
                    COUNT(*) as count
                FROM teacher_surveys
                WHERE institution_type IS NOT NULL
                GROUP BY institution_type
                ORDER BY count DESC
            `;
            const result = await query(text);
            return result.rows;
        } catch (error) {
            throw new Error(`Error al obtener distribución por institución: ${error.message}`);
        }
    }

    // Obtener propósitos más comunes
    static async getMostCommonPurposes() {
        try {
            const text = `
                SELECT 
                    UNNEST(purposes) as purpose,
                    COUNT(*) as count
                FROM teacher_surveys
                WHERE purposes IS NOT NULL
                GROUP BY purpose
                ORDER BY count DESC
            `;
            const result = await query(text);
            return result.rows;
        } catch (error) {
            throw new Error(`Error al obtener propósitos más comunes: ${error.message}`);
        }
    }

    // Obtener desafíos más comunes
    static async getMostCommonChallenges() {
        try {
            const text = `
                SELECT 
                    UNNEST(challenges) as challenge,
                    COUNT(*) as count
                FROM teacher_surveys
                WHERE challenges IS NOT NULL
                GROUP BY challenge
                ORDER BY count DESC
            `;
            const result = await query(text);
            return result.rows;
        } catch (error) {
            throw new Error(`Error al obtener desafíos más comunes: ${error.message}`);
        }
    }

    // Obtener recursos más solicitados
    static async getMostRequestedResources() {
        try {
            const text = `
                SELECT 
                    UNNEST(resources_needed) as resource,
                    COUNT(*) as count
                FROM teacher_surveys
                WHERE resources_needed IS NOT NULL
                GROUP BY resource
                ORDER BY count DESC
            `;
            const result = await query(text);
            return result.rows;
        } catch (error) {
            throw new Error(`Error al obtener recursos más solicitados: ${error.message}`);
        }
    }

    // Verificar si el usuario ya tiene encuestas
    static async userHasSurveys(userId) {
        try {
            const text = `
                SELECT EXISTS(
                    SELECT 1 FROM teacher_surveys WHERE user_id = $1
                ) as has_surveys
            `;
            const result = await query(text, [userId]);
            return result.rows[0].has_surveys;
        } catch (error) {
            throw new Error(`Error al verificar encuestas del usuario: ${error.message}`);
        }
    }
}

export default TeacherSurvey;