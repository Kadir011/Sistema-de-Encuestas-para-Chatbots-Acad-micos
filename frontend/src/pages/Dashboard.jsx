import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import surveyService from '../services/surveyService';
import { FileText, Users, BarChart3, TrendingUp, Plus } from 'lucide-react';
import Header from '../components/layout/Header';
import StatsCard from '../components/dashboard/StatsCard';
import RecentActivity from '../components/dashboard/RecentActivity';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import Alert from '../components/common/Alert';

const Dashboard = () => {
    const { user, isStudent, isTeacher, isAdmin } = useAuth();
    const [stats, setStats] = useState(null);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            setError('');
            if (isStudent()) {
                try {
                    // Obtener encuestas del estudiante y calcular métricas en tiempo real
                    const surveyResponse = await surveyService.student.getMySurveys().catch(() => ({ surveys: [] }));
                    const surveys = surveyResponse?.surveys || [];

                    const total = surveys.length;
                    const withExperience = surveys.filter(s => s.has_used_chatbot === true).length;
                    const recommendCount = surveys.filter(s => s.would_recommend === true).length;
                    const avgUsefulness = surveys.reduce((acc, s) => {
                        const v = parseFloat(s.usefulness_rating);
                        return acc + (isNaN(v) ? 0 : v);
                    }, 0) / (surveys.filter(s => !isNaN(parseFloat(s.usefulness_rating))).length || 1);

                    // Conteo semanal
                    const oneWeekAgo = new Date();
                    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                    const weekly = surveys.filter(s => new Date(s.created_at) > oneWeekAgo).length;

                    setStats({
                        total_surveys: total,
                        with_experience: withExperience,
                        recommend_count: recommendCount,
                        avg_usefulness: Number.isFinite(avgUsefulness) ? parseFloat(avgUsefulness.toFixed(2)) : 0,
                        weekly_surveys: weekly,
                    });

                    // Recent activity
                    surveys.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                    const recentSurveys = surveys.slice(0, 5).map(survey => ({
                        type: 'survey_created',
                        title: 'Encuesta de Estudiante Creada',
                        description: survey.title || '',
                        timestamp: survey.created_at,
                    }));
                    setActivities(recentSurveys);
                } catch (err) {
                    console.warn('No se pudieron cargar estadísticas de estudiante:', err);
                    setStats({
                        total_surveys: 0,
                        with_experience: 0,
                        recommend_count: 0,
                        avg_usefulness: 0,
                        weekly_surveys: 0,
                    });
                    setActivities([]);
                }
            } else if (isTeacher()) {
                try {
                    // Obtener encuestas del profesor y calcular métricas en tiempo real
                    const surveyResponse = await surveyService.teacher.getMySurveys().catch(() => ({ surveys: [] }));
                    const surveys = surveyResponse?.surveys || [];

                    const total = surveys.length;
                    const withExperience = surveys.filter(s => s.has_used_chatbot === true).length;
                    // Algunos formularios de profesor pueden no tener 'would_recommend'; manejar opcionalmente
                    const recommendCount = surveys.filter(s => s.would_recommend === true).length;
                    const avgUsefulness = surveys.reduce((acc, s) => {
                        const v = parseFloat(s.usefulness_rating);
                        return acc + (isNaN(v) ? 0 : v);
                    }, 0) / (surveys.filter(s => !isNaN(parseFloat(s.usefulness_rating))).length || 1);

                    const oneWeekAgo = new Date();
                    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                    const weekly = surveys.filter(s => new Date(s.created_at) > oneWeekAgo).length;

                    setStats({
                        total_surveys: total,
                        with_experience: withExperience,
                        recommend_count: recommendCount,
                        avg_usefulness: Number.isFinite(avgUsefulness) ? parseFloat(avgUsefulness.toFixed(2)) : 0,
                        weekly_surveys: weekly,
                    });

                    // Recent activity
                    surveys.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                    const recentSurveys = surveys.slice(0, 5).map(survey => ({
                        type: 'survey_created',
                        title: 'Encuesta de Profesor Creada',
                        description: survey.title || '',
                        timestamp: survey.created_at,
                    }));
                    setActivities(recentSurveys);
                } catch (err) {
                    console.warn('No se pudieron cargar estadísticas de profesor:', err);
                    setStats({
                        total_surveys: 0,
                        with_experience: 0,
                        recommend_count: 0,
                        avg_usefulness: 0,
                        weekly_surveys: 0,
                    });
                    setActivities([]);
                }
            } else if (isAdmin()) {
                try {
                    // Cargar todas las encuestas para admin (para conteos en tiempo real)
                    const studentSurveysResp = await surveyService.student.getAll().catch(() => ({ surveys: [] }));
                    const teacherSurveysResp = await surveyService.teacher.getAll().catch(() => ({ surveys: [] }));
                    
                    const studentSurveys = studentSurveysResp?.surveys || [];
                    const teacherSurveys = teacherSurveysResp?.surveys || [];
                    
                    // Contar encuestas de esta semana
                    const oneWeekAgo = new Date();
                    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                    
                    const studentSurveysThisWeek = studentSurveys.filter(s => new Date(s.created_at) > oneWeekAgo).length;
                    const teacherSurveysThisWeek = teacherSurveys.filter(s => new Date(s.created_at) > oneWeekAgo).length;
                    
                    setStats({
                        total_surveys: studentSurveys.length + teacherSurveys.length,
                        student_surveys: studentSurveys.length,
                        teacher_surveys: teacherSurveys.length,
                        weekly_surveys: studentSurveysThisWeek + teacherSurveysThisWeek,
                    });

                    // Cargar encuestas recientes para admin (todas)
                    const allSurveys = [
                        ...studentSurveys.map(s => ({ ...s, surveyType: 'student' })),
                        ...teacherSurveys.map(s => ({ ...s, surveyType: 'teacher' }))
                    ];

                    allSurveys.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                    const recentSurveys = allSurveys.slice(0, 5).map(survey => ({
                        type: 'survey_created',
                        title: survey.surveyType === 'student' ? 'Encuesta de Estudiante Creada' : 'Encuesta de Profesor Creada',
                        description: survey.title,
                        timestamp: survey.created_at,
                    }));
                    setActivities(recentSurveys);
                } catch (err) {
                    console.warn('No se pudieron cargar estadísticas de admin:', err);
                    setStats({
                        total_surveys: 0,
                        student_surveys: 0,
                        teacher_surveys: 0,
                        weekly_surveys: 0,
                    });
                    setActivities([]);
                }
            }
        } catch (err) {
            console.error('Error general al cargar dashboard:', err);
            setStats({
                total_surveys: 0,
                student_surveys: 0,
                teacher_surveys: 0,
                weekly_surveys: 0,
            });
            setActivities([]);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <Loading fullScreen text="Cargando dashboard..." />;
    }

    return (
        <div>
            <Header 
                title={`Bienvenido, ${user?.username}`}
                subtitle="Aquí está un resumen de tu actividad"
            />

            {error && (
                <Alert type="error" message={error} onClose={() => setError('')} className="mb-6" />
            )}

            {/* Quick Actions */}
            <div className="mb-8 flex flex-wrap gap-4">
                {isStudent() && (
                    <Link to="/student-survey">
                        <Button icon={<Plus size={20} />}>
                            Nueva Encuesta de Estudiante
                        </Button>
                    </Link>
                )}
                {isTeacher() && (
                    <Link to="/teacher-survey">
                        <Button icon={<Plus size={20} />}>
                            Nueva Encuesta de Profesor
                        </Button>
                    </Link>
                )}
                <Link to="/my-surveys">
                    <Button variant="outline" icon={<FileText size={20} />}>
                        Mis Encuestas
                    </Button>
                </Link>
                <Link to="/statistics">
                    <Button variant="outline" icon={<BarChart3 size={20} />}>
                        Ver Estadísticas
                    </Button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                    title="Total de Encuestas"
                    value={stats?.total_surveys || 0}
                    icon={FileText}
                    color="blue"
                    trend={12}
                    trendLabel="vs mes anterior"
                />
                {isAdmin() && (
                    <>
                        <StatsCard
                            title="Encuestas Estudiantes"
                            value={stats?.student_surveys || 0}
                            icon={Users}
                            color="green"
                        />
                        <StatsCard
                            title="Encuestas Profesores"
                            value={stats?.teacher_surveys || 0}
                            icon={Users}
                            color="purple"
                        />
                    </>
                )}
                <StatsCard
                    title="Respuestas esta semana"
                    value={stats?.weekly_surveys || 0}
                    icon={TrendingUp}
                    color="yellow"
                    trend={8}
                    trendLabel="vs semana anterior"
                />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <RecentActivity activities={activities} />
                </div>
                
                {/* Quick Info */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Información Rápida
                    </h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm font-medium text-blue-900 mb-1">
                                Contribuye con tu experiencia
                            </p>
                            <p className="text-xs text-blue-700">
                                Comparte cómo usas chatbots de IA en tu día a día
                            </p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                            <p className="text-sm font-medium text-green-900 mb-1">
                                Ayuda a la investigación
                            </p>
                            <p className="text-xs text-green-700">
                                Tus respuestas ayudan a entender mejor el uso de IA en educación
                            </p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg">
                            <p className="text-sm font-medium text-purple-900 mb-1">
                                Datos seguros
                            </p>
                            <p className="text-xs text-purple-700">
                                Tu información está protegida y es confidencial
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;