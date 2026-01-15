import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import surveyService from '../services/surveyService';
import Header from '../components/layout/Header';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Alert from '../components/common/Alert';
import Loading from '../components/common/Loading';
import Badge from '../components/common/Badge';
import { Edit2, Trash2, Eye, Plus } from 'lucide-react';

const MySurveys = () => {
    const navigate = useNavigate();
    const { isStudent, isTeacher, isAdmin } = useAuth();
    const [studentSurveys, setStudentSurveys] = useState([]);
    const [teacherSurveys, setTeacherSurveys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, survey: null, type: null });
    const [detailsModal, setDetailsModal] = useState({ isOpen: false, survey: null, type: null });
    const [activeTab, setActiveTab] = useState('student'); // Para admin: tab entre estudiantes y profesores

    useEffect(() => {
        loadSurveys();
    }, []);

    const loadSurveys = async () => {
        try {
            setLoading(true);
            setError('');
            
            if (isAdmin()) {
                // Admin puede ver TODAS las encuestas
                try {
                    const studentResponse = await surveyService.student.getAll().catch(() => ({ surveys: [] }));
                    setStudentSurveys(studentResponse?.surveys || []);
                } catch (err) {
                    console.warn('Error cargando encuestas de estudiantes:', err);
                }
                
                try {
                    const teacherResponse = await surveyService.teacher.getAll().catch(() => ({ surveys: [] }));
                    setTeacherSurveys(teacherResponse?.surveys || []);
                } catch (err) {
                    console.warn('Error cargando encuestas de profesores:', err);
                }
            } else if (isStudent()) {
                // Estudiante ve solo sus encuestas
                const response = await surveyService.student.getMySurveys().catch(() => ({ surveys: [] }));
                setStudentSurveys(response?.surveys || []);
            } else if (isTeacher()) {
                // Profesor ve solo sus encuestas
                const response = await surveyService.teacher.getMySurveys().catch(() => ({ surveys: [] }));
                setTeacherSurveys(response?.surveys || []);
            }
        } catch (err) {
            setError('Error al cargar encuestas');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (survey, type) => {
        setDeleteModal({ isOpen: true, survey, type });
    };

    const handleViewDetails = (survey, type) => {
        setDetailsModal({ isOpen: true, survey, type });
    };

    const confirmDelete = async () => {
        try {
            const { survey, type } = deleteModal;
            
            if (type === 'student') {
                await surveyService.student.delete(survey.id);
                setStudentSurveys(prev => prev.filter(s => s.id !== survey.id));
            } else if (type === 'teacher') {
                await surveyService.teacher.delete(survey.id);
                setTeacherSurveys(prev => prev.filter(s => s.id !== survey.id));
            }
            
            setSuccess('Encuesta eliminada exitosamente');
            setDeleteModal({ isOpen: false, survey: null, type: null });
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Error al eliminar encuesta');
            console.error(err);
        }
    };

    if (loading) {
        return <Loading fullScreen text="Cargando encuestas..." />;
    }

    const getDisplayTitle = () => {
        if (isAdmin()) return 'Gestión de Encuestas';
        return 'Mis Encuestas';
    };

    const getDisplaySubtitle = () => {
        if (isAdmin()) return 'Administra todas las encuestas del sistema';
        return 'Visualiza y gestiona tus encuestas';
    };

    const renderSurveyTable = (surveys, type) => {
        if (!surveys || surveys.length === 0) {
            return (
                <div className="p-8 text-center text-gray-500">
                    <p>No hay encuestas de {type === 'student' ? 'estudiantes' : 'profesores'}</p>
                </div>
            );
        }

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Usuario
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Chatbots Usados
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tareas
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Recomendación
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Fecha
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {surveys.map((survey) => (
                            <tr key={survey.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <p className="font-medium text-gray-900">{survey.username || 'N/A'}</p>
                                    <p className="text-xs text-gray-500">{survey.email || ''}</p>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {survey.chatbots_used && Array.isArray(survey.chatbots_used)
                                        ? survey.chatbots_used.join(', ')
                                        : 'N/A'}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {type === 'student'
                                        ? (survey.tasks_used_for && Array.isArray(survey.tasks_used_for)
                                            ? survey.tasks_used_for.join(', ')
                                            : 'N/A')
                                        : (survey.purposes && Array.isArray(survey.purposes)
                                            ? survey.purposes.join(', ')
                                            : 'N/A')
                                    }
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {survey.would_recommend ? (
                                        <Badge color="green">Sí</Badge>
                                    ) : (
                                        <Badge color="red">No</Badge>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {new Date(survey.created_at).toLocaleDateString('es-ES')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleViewDetails(survey, type)}
                                            className="text-blue-600 hover:text-blue-800 transition-colors"
                                            title="Ver detalles"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        {isAdmin() && (
                                            <button
                                                onClick={() => handleDelete(survey, type)}
                                                className="text-red-600 hover:text-red-800 transition-colors"
                                                title="Eliminar"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div>
            <Header 
                title={getDisplayTitle()}
                subtitle={getDisplaySubtitle()}
            />

            {error && (
                <Alert type="error" message={error} onClose={() => setError('')} className="mb-6" />
            )}

            {success && (
                <Alert type="success" message={success} onClose={() => setSuccess('')} className="mb-6" />
            )}

            {isAdmin() ? (
                <div>
                    {/* Tabs para admin */}
                    <div className="mb-6">
                        <div className="bg-white rounded-lg shadow-md border-b">
                            <div className="flex">
                                <button
                                    onClick={() => setActiveTab('student')}
                                    className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                                        activeTab === 'student'
                                            ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                                            : 'text-gray-600 hover:text-gray-800'
                                    }`}
                                >
                                    Encuestas de Estudiantes ({studentSurveys.length})
                                </button>
                                <button
                                    onClick={() => setActiveTab('teacher')}
                                    className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                                        activeTab === 'teacher'
                                            ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                                            : 'text-gray-600 hover:text-gray-800'
                                    }`}
                                >
                                    Encuestas de Profesores ({teacherSurveys.length})
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Contenido del tab */}
                    <div className="bg-white rounded-lg shadow-md">
                        {activeTab === 'student' && renderSurveyTable(studentSurveys, 'student')}
                        {activeTab === 'teacher' && renderSurveyTable(teacherSurveys, 'teacher')}
                    </div>
                </div>
            ) : isStudent() ? (
                <div className="bg-white rounded-lg shadow-md">
                    {renderSurveyTable(studentSurveys, 'student')}
                </div>
            ) : isTeacher() ? (
                <div className="bg-white rounded-lg shadow-md">
                    {renderSurveyTable(teacherSurveys, 'teacher')}
                </div>
            ) : null}

            {/* Modal de confirmación de eliminación */}
            <Modal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, survey: null, type: null })}
                title="Confirmar Eliminación"
            >
                <div className="space-y-4">
                    <p className="text-gray-600">
                        ¿Estás seguro de que deseas eliminar esta encuesta?
                    </p>
                    <p className="text-sm text-red-600">
                        Esta acción no se puede deshacer.
                    </p>
                    <div className="flex gap-3 justify-end pt-4 border-t">
                        <Button
                            variant="secondary"
                            onClick={() => setDeleteModal({ isOpen: false, survey: null, type: null })}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="danger"
                            onClick={confirmDelete}
                        >
                            Eliminar Encuesta
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Modal de detalles de encuesta */}
            <Modal
                isOpen={detailsModal.isOpen}
                onClose={() => setDetailsModal({ isOpen: false, survey: null, type: null })}
                size="lg"
            >
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {detailsModal.survey && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase">Usuario</p>
                                    <p className="text-sm font-medium text-gray-900">{detailsModal.survey.username}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase">Email</p>
                                    <p className="text-sm text-gray-600">{detailsModal.survey.email}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase">Fecha</p>
                                    <p className="text-sm text-gray-600">
                                        {new Date(detailsModal.survey.created_at).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>

                            <hr />

                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Chatbots Utilizados</p>
                                <div className="flex flex-wrap gap-2">
                                    {detailsModal.survey.chatbots_used && Array.isArray(detailsModal.survey.chatbots_used) ? (
                                        detailsModal.survey.chatbots_used.map((chatbot, idx) => (
                                            <Badge key={idx} color="blue">{chatbot}</Badge>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500">No especificado</p>
                                    )}
                                </div>
                            </div>

                            {detailsModal.type === 'student' ? (
                                <>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Tareas Utilizadas</p>
                                        <div className="flex flex-wrap gap-2">
                                            {detailsModal.survey.tasks_used_for && Array.isArray(detailsModal.survey.tasks_used_for) ? (
                                                detailsModal.survey.tasks_used_for.map((task, idx) => (
                                                    <Badge key={idx} color="green">{task}</Badge>
                                                ))
                                            ) : (
                                                <p className="text-sm text-gray-500">No especificado</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase">Frecuencia de Uso</p>
                                            <p className="text-sm text-gray-600">{detailsModal.survey.usage_frequency || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase">Chatbot Preferido</p>
                                            <p className="text-sm text-gray-600">{detailsModal.survey.preferred_chatbot || 'N/A'}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Calificación Utilidad</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {detailsModal.survey.usefulness_rating ? `${detailsModal.survey.usefulness_rating}/5` : 'N/A'}
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Propósitos</p>
                                        <div className="flex flex-wrap gap-2">
                                            {detailsModal.survey.purposes && Array.isArray(detailsModal.survey.purposes) ? (
                                                detailsModal.survey.purposes.map((purpose, idx) => (
                                                    <Badge key={idx} color="green">{purpose}</Badge>
                                                ))
                                            ) : (
                                                <p className="text-sm text-gray-500">No especificado</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Cursos Utilizados</p>
                                        <div className="flex flex-wrap gap-2">
                                            {detailsModal.survey.courses_used && Array.isArray(detailsModal.survey.courses_used) ? (
                                                detailsModal.survey.courses_used.map((course, idx) => (
                                                    <Badge key={idx} color="purple">{course}</Badge>
                                                ))
                                            ) : (
                                                <p className="text-sm text-gray-500">No especificado</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Desafíos</p>
                                        <div className="flex flex-wrap gap-2">
                                            {detailsModal.survey.challenges && (Array.isArray(detailsModal.survey.challenges) ? detailsModal.survey.challenges.length > 0 : detailsModal.survey.challenges.trim() !== '') ? (
                                                Array.isArray(detailsModal.survey.challenges) ? (
                                                    detailsModal.survey.challenges.map((challenge, idx) => (
                                                        <Badge key={idx} color="blue">{challenge}</Badge>
                                                    ))
                                                ) : (
                                                    detailsModal.survey.challenges.split('\n').filter(c => c.trim()).map((challenge, idx) => (
                                                        <Badge key={idx} color="blue">{challenge.trim()}</Badge>
                                                    ))
                                                )
                                            ) : (
                                                <p className="text-sm text-gray-500">No especificado</p>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}

                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Recomendación</p>
                                <Badge color={detailsModal.survey.would_recommend ? 'green' : 'red'}>
                                    {detailsModal.survey.would_recommend ? 'Sí' : 'No'}
                                </Badge>
                            </div>
                        </>
                    )}

                    <div className="flex gap-3 justify-end pt-4 border-t">
                        <Button
                            onClick={() => setDetailsModal({ isOpen: false, survey: null, type: null })}
                        >
                            Cerrar
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default MySurveys;