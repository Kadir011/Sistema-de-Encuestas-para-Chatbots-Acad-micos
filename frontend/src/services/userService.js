import api from './api';

const userService = {
    // Obtener todos los usuarios (admin)
    getAll: async () => {
        try {
            const response = await api.get('/users');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Obtener usuario por ID
    getById: async (id) => {
        try {
            const response = await api.get(`/users/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Crear usuario (admin)
    create: async (userData) => {
        try {
            const response = await api.post('/users', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Actualizar usuario
    update: async (id, userData) => {
        try {
            const response = await api.put(`/users/${id}`, userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Eliminar usuario (admin)
    delete: async (id) => {
        try {
            const response = await api.delete(`/users/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Obtener estadísticas de usuarios (admin)
    getStatistics: async () => {
        try {
            const response = await api.get('/users/statistics');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};

export default userService;