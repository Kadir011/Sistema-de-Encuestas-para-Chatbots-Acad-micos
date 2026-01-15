import api from './api';

const surveyService = {
    // ========== ENCUESTAS DE ESTUDIANTES ==========
    student: {
        // Crear encuesta
        create: async (surveyData) => {
            try {
                const response = await api.post('/student-surveys', surveyData);
                return response.data;
            } catch (error) {
                throw error.response?.data || error;
            }
        },

        // Obtener todas (admin)
        getAll: async () => {
            try {
                const response = await api.get('/student-surveys');
                return response.data;
            } catch (error) {
                throw error.response?.data || error;
            }
        },

        // Obtener por ID
        getById: async (id) => {
            try {
                const response = await api.get(`/student-surveys/${id}`);
                return response.data;
            } catch (error) {
                throw error.response?.data || error;
            }
        },

        // Obtener mis encuestas
        getMySurveys: async () => {
            try {
                const response = await api.get('/student-surveys/my-surveys');
                return response.data;
            } catch (error) {
                throw error.response?.data || error;
            }
        },

        // Actualizar encuesta
        update: async (id, surveyData) => {
            try {
                const response = await api.put(`/student-surveys/${id}`, surveyData);
                return response.data;
            } catch (error) {
                throw error.response?.data || error;
            }
        },

        // Eliminar encuesta
        delete: async (id) => {
            try {
                const response = await api.delete(`/student-surveys/${id}`);
                return response.data;
            } catch (error) {
                throw error.response?.data || error;
            }
        },

        // Obtener estadísticas
        getStatistics: async () => {
            try {
                const response = await api.get('/student-surveys/statistics');
                return response.data;
            } catch (error) {
                throw error.response?.data || error;
            }
        },

        // Obtener mis estadísticas
        getMyStatistics: async () => {
            try {
                const response = await api.get('/student-surveys/my-statistics');
                return response.data;
            } catch (error) {
                throw error.response?.data || error;
            }
        },
    },

    // ========== ENCUESTAS DE PROFESORES ==========
    teacher: {
        // Crear encuesta
        create: async (surveyData) => {
            try {
                const response = await api.post('/teacher-surveys', surveyData);
                return response.data;
            } catch (error) {
                throw error.response?.data || error;
            }
        },

        // Obtener todas (admin)
        getAll: async () => {
            try {
                const response = await api.get('/teacher-surveys');
                return response.data;
            } catch (error) {
                throw error.response?.data || error;
            }
        },

        // Obtener por ID
        getById: async (id) => {
            try {
                const response = await api.get(`/teacher-surveys/${id}`);
                return response.data;
            } catch (error) {
                throw error.response?.data || error;
            }
        },

        // Obtener mis encuestas
        getMySurveys: async () => {
            try {
                const response = await api.get('/teacher-surveys/my-surveys');
                return response.data;
            } catch (error) {
                throw error.response?.data || error;
            }
        },

        // Actualizar encuesta
        update: async (id, surveyData) => {
            try {
                const response = await api.put(`/teacher-surveys/${id}`, surveyData);
                return response.data;
            } catch (error) {
                throw error.response?.data || error;
            }
        },

        // Eliminar encuesta
        delete: async (id) => {
            try {
                const response = await api.delete(`/teacher-surveys/${id}`);
                return response.data;
            } catch (error) {
                throw error.response?.data || error;
            }
        },

        // Obtener estadísticas
        getStatistics: async () => {
            try {
                const response = await api.get('/teacher-surveys/statistics');
                return response.data;
            } catch (error) {
                throw error.response?.data || error;
            }
        },

        // Obtener mis estadísticas
        getMyStatistics: async () => {
            try {
                const response = await api.get('/teacher-surveys/my-statistics');
                return response.data;
            } catch (error) {
                throw error.response?.data || error;
            }
        },
    },
};

export default surveyService;