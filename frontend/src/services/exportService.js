import api from './api';

const exportService = {
    // Exportar encuestas de estudiantes
    exportStudentSurveys: async (queryParams = '') => {
        try {
            const url = `/export/student-surveys${queryParams ? '?' + queryParams : ''}`;
            const response = await api.get(url);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Exportar encuestas de profesores
    exportTeacherSurveys: async (queryParams = '') => {
        try {
            const url = `/export/teacher-surveys${queryParams ? '?' + queryParams : ''}`;
            const response = await api.get(url);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Exportar estadísticas
    exportStatistics: async (type = '') => {
        try {
            const url = `/export/statistics${type ? '?type=' + type : ''}`;
            const response = await api.get(url);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};

export default exportService;