import { createContext, useState, useCallback } from 'react';
import surveyService from '../services/surveyService';

export const SurveyContext = createContext();

export const SurveyProvider = ({ children }) => {
    const [surveys, setSurveys] = useState([]);
    const [currentSurvey, setCurrentSurvey] = useState(null);
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ========== ENCUESTAS DE ESTUDIANTES ==========
    
    // Crear encuesta de estudiante
    const createStudentSurvey = async (surveyData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await surveyService.student.create(surveyData);
            return response;
        } catch (error) {
            setError(error.message || 'Error al crear encuesta');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Obtener mis encuestas de estudiante
    const getMyStudentSurveys = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await surveyService.student.getMySurveys();
            setSurveys(response.surveys || []);
            return response;
        } catch (error) {
            setError(error.message || 'Error al obtener encuestas');
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    // Obtener todas las encuestas de estudiantes (admin)
    const getAllStudentSurveys = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await surveyService.student.getAll();
            setSurveys(response.surveys || []);
            return response;
        } catch (error) {
            setError(error.message || 'Error al obtener encuestas');
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    // Obtener encuesta de estudiante por ID
    const getStudentSurveyById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await surveyService.student.getById(id);
            setCurrentSurvey(response.survey);
            return response;
        } catch (error) {
            setError(error.message || 'Error al obtener encuesta');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Actualizar encuesta de estudiante
    const updateStudentSurvey = async (id, surveyData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await surveyService.student.update(id, surveyData);
            return response;
        } catch (error) {
            setError(error.message || 'Error al actualizar encuesta');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Eliminar encuesta de estudiante
    const deleteStudentSurvey = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await surveyService.student.delete(id);
            setSurveys(prev => prev.filter(survey => survey.id !== id));
            return response;
        } catch (error) {
            setError(error.message || 'Error al eliminar encuesta');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Obtener estadísticas de estudiantes
    const getStudentStatistics = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await surveyService.student.getStatistics();
            setStatistics(response.statistics);
            return response;
        } catch (error) {
            setError(error.message || 'Error al obtener estadísticas');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Obtener mis estadísticas de estudiante
    const getMyStudentStatistics = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await surveyService.student.getMyStatistics();
            setStatistics(response.statistics);
            return response;
        } catch (error) {
            setError(error.message || 'Error al obtener estadísticas');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // ========== ENCUESTAS DE PROFESORES ==========
    
    // Crear encuesta de profesor
    const createTeacherSurvey = async (surveyData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await surveyService.teacher.create(surveyData);
            return response;
        } catch (error) {
            setError(error.message || 'Error al crear encuesta');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Obtener mis encuestas de profesor
    const getMyTeacherSurveys = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await surveyService.teacher.getMySurveys();
            setSurveys(response.surveys || []);
            return response;
        } catch (error) {
            setError(error.message || 'Error al obtener encuestas');
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    // Obtener todas las encuestas de profesores (admin)
    const getAllTeacherSurveys = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await surveyService.teacher.getAll();
            setSurveys(response.surveys || []);
            return response;
        } catch (error) {
            setError(error.message || 'Error al obtener encuestas');
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    // Obtener encuesta de profesor por ID
    const getTeacherSurveyById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await surveyService.teacher.getById(id);
            setCurrentSurvey(response.survey);
            return response;
        } catch (error) {
            setError(error.message || 'Error al obtener encuesta');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Actualizar encuesta de profesor
    const updateTeacherSurvey = async (id, surveyData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await surveyService.teacher.update(id, surveyData);
            return response;
        } catch (error) {
            setError(error.message || 'Error al actualizar encuesta');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Eliminar encuesta de profesor
    const deleteTeacherSurvey = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await surveyService.teacher.delete(id);
            setSurveys(prev => prev.filter(survey => survey.id !== id));
            return response;
        } catch (error) {
            setError(error.message || 'Error al eliminar encuesta');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Obtener estadísticas de profesores
    const getTeacherStatistics = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await surveyService.teacher.getStatistics();
            setStatistics(response.statistics);
            return response;
        } catch (error) {
            setError(error.message || 'Error al obtener estadísticas');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Obtener mis estadísticas de profesor
    const getMyTeacherStatistics = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await surveyService.teacher.getMyStatistics();
            setStatistics(response.statistics);
            return response;
        } catch (error) {
            setError(error.message || 'Error al obtener estadísticas');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Limpiar errores
    const clearError = () => setError(null);

    const value = {
        surveys,
        currentSurvey,
        statistics,
        loading,
        error,
        clearError,
        // Student surveys
        createStudentSurvey,
        getMyStudentSurveys,
        getAllStudentSurveys,
        getStudentSurveyById,
        updateStudentSurvey,
        deleteStudentSurvey,
        getStudentStatistics,
        getMyStudentStatistics,
        // Teacher surveys
        createTeacherSurvey,
        getMyTeacherSurveys,
        getAllTeacherSurveys,
        getTeacherSurveyById,
        updateTeacherSurvey,
        deleteTeacherSurvey,
        getTeacherStatistics,
        getMyTeacherStatistics,
    };

    return (
        <SurveyContext.Provider value={value}>
            {children}
        </SurveyContext.Provider>
    );
};