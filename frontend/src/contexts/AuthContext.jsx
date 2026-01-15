import { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Cargar usuario al iniciar
    useEffect(() => {
        const loadUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const currentUser = authService.getCurrentUser();
                    setUser(currentUser);
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Error al cargar usuario:', error);
                logout();
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    // Registrar usuario
    const register = async (userData) => {
        try {
            const response = await authService.register(userData);
            setUser(response.user);
            setIsAuthenticated(true);
            return response;
        } catch (error) {
            throw error;
        }
    };

    // Iniciar sesión
    const login = async (credentials) => {
        try {
            const response = await authService.login(credentials);
            setUser(response.user);
            setIsAuthenticated(true);
            return response;
        } catch (error) {
            throw error;
        }
    };

    // Cerrar sesión
    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    // Actualizar perfil
    const updateProfile = async (userData) => {
        try {
            const response = await authService.getProfile();
            setUser(response.user);
            return response;
        } catch (error) {
            throw error;
        }
    };

    // Verificar rol
    const hasRole = (role) => {
        return user?.role === role;
    };

    // Verificar si es admin
    const isAdmin = () => {
        return user?.role === 'admin';
    };

    // Verificar si es profesor
    const isTeacher = () => {
        return user?.role === 'teacher';
    };

    // Verificar si es estudiante
    const isStudent = () => {
        return user?.role === 'student';
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        register,
        login,
        logout,
        updateProfile,
        hasRole,
        isAdmin,
        isTeacher,
        isStudent,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};