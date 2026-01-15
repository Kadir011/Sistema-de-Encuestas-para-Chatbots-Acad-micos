import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import surveyService from '../services/surveyService';
import Header from '../components/layout/Header';
import Chart from '../components/dashboard/Chart';
import StatsCard from '../components/dashboard/StatsCard';
import Loading from '../components/common/Loading';
import Alert from '../components/common/Alert';
import { BarChart3, PieChart, TrendingUp, Users } from 'lucide-react';

const Statistics = () => {
    const { isStudent, isTeacher, isAdmin } = useAuth();
    const [stats, setStats] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadStatistics();
    }, []);

    const loadStatistics = async () => {
        try {
            setLoading(true);
            let response;
            let allSurveys = [];
            
            // Obtener estadísticas según el rol del usuario
            if (isStudent()) {
                response = await surveyService.student.getStatistics().catch(() => ({ statistics: {} }));
                const surveyResponse = await surveyService.student.getMySurveys().catch(() => ({ surveys: [] }));
                allSurveys = surveyResponse?.surveys || [];
            } else if (isTeacher()) {
                response = await surveyService.teacher.getStatistics().catch(() => ({ statistics: {} }));
                const surveyResponse = await surveyService.teacher.getMySurveys().catch(() => ({ surveys: [] }));
                allSurveys = surveyResponse?.surveys || [];
            } else if (isAdmin()) {
                // Los admins ven todas las encuestas de estudiantes
                response = await surveyService.student.getStatistics().catch(() => ({ statistics: {} }));
                const studentResponse = await surveyService.student.getAll().catch(() => ({ surveys: [] }));
                const teacherResponse = await surveyService.teacher.getAll().catch(() => ({ surveys: [] }));
                allSurveys = [
                    ...(studentResponse?.surveys || []),
                    ...(teacherResponse?.surveys || [])
                ];
            }
            
            // Calcular métricas en tiempo real a partir de las encuestas cargadas (allSurveys)
            const totalSurveys = allSurveys.length;
            const usersWithChatbot = allSurveys.filter(s => s.has_used_chatbot === true).length;
            const wouldRecommend = allSurveys.filter(s => s.would_recommend === true).length;
            const avgUsefulness = allSurveys.reduce((acc, s) => {
                const v = parseFloat(s.usefulness_rating);
                return acc + (isNaN(v) ? 0 : v);
            }, 0) / (allSurveys.filter(s => !isNaN(parseFloat(s.usefulness_rating))).length || 1);

            setStats({
                total_surveys: totalSurveys,
                users_with_chatbot: usersWithChatbot,
                avg_usefulness: Number.isFinite(avgUsefulness) ? parseFloat(avgUsefulness.toFixed(2)) : 0,
                will_continue: 0,
                would_recommend: wouldRecommend,
            });

            // Calcular distribución mensual real
            const calculateMonthlyData = (surveys) => {
                const monthData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                surveys?.forEach(survey => {
                    if (survey.created_at) {
                        const date = new Date(survey.created_at);
                        const month = date.getMonth(); // 0-11
                        monthData[month]++;
                    }
                });
                return monthData;
            };

            // Calcular distribución de uso de chatbots
            const calculateChatbotUsage = (surveys) => {
                const chatbotCounts = {
                    'ChatGPT': 0,
                    'Claude': 0,
                    'Gemini': 0,
                    'Copilot': 0,
                    'Perplexity': 0,
                };

                surveys?.forEach(survey => {
                    if (survey.chatbots_used && Array.isArray(survey.chatbots_used)) {
                        survey.chatbots_used.forEach(chatbot => {
                            if (chatbotCounts.hasOwnProperty(chatbot)) {
                                chatbotCounts[chatbot]++;
                            }
                        });
                    }
                });

                return [
                    chatbotCounts['ChatGPT'],
                    chatbotCounts['Claude'],
                    chatbotCounts['Gemini'],
                    chatbotCounts['Copilot'],
                    chatbotCounts['Perplexity'],
                ];
            };

            const monthlyData = calculateMonthlyData(allSurveys);
            const chatbotUsageData = calculateChatbotUsage(allSurveys);
            const monthLabels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

            setChartData({
                monthly: {
                    labels: monthLabels,
                    datasets: [{
                        label: 'Encuestas por Mes',
                        data: monthlyData,
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true,
                        pointRadius: 4,
                        pointBackgroundColor: 'rgb(59, 130, 246)',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                    }],
                },
                chatbots: {
                    labels: ['ChatGPT', 'Claude', 'Gemini', 'Copilot', 'Perplexity'],
                    datasets: [{
                        label: 'Uso de Chatbots',
                        data: chatbotUsageData,
                        backgroundColor: [
                            'rgba(59, 130, 246, 0.8)',
                            'rgba(16, 185, 129, 0.8)',
                            'rgba(251, 191, 36, 0.8)',
                            'rgba(239, 68, 68, 0.8)',
                            'rgba(168, 85, 247, 0.8)',
                        ],
                        borderWidth: 1,
                        borderColor: '#fff',
                    }],
                },
            });
        } catch (err) {
            setError('Error al cargar estadísticas');
            console.error(err);
            // Usar valores por defecto (0) en caso de error
            setStats({
                total_surveys: 0,
                users_with_chatbot: 0,
                avg_usefulness: 0,
                will_continue: 0,
                would_recommend: 0,
            });
            setChartData({
                monthly: {
                    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                    datasets: [{
                        label: 'Encuestas por Mes',
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true,
                        pointRadius: 4,
                        pointBackgroundColor: 'rgb(59, 130, 246)',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                    }],
                },
                chatbots: {
                    labels: ['ChatGPT', 'Claude', 'Gemini', 'Copilot', 'Perplexity'],
                    datasets: [{
                        label: 'Uso de Chatbots',
                        data: [0, 0, 0, 0, 0],
                        backgroundColor: [
                            'rgba(59, 130, 246, 0.8)',
                            'rgba(16, 185, 129, 0.8)',
                            'rgba(251, 191, 36, 0.8)',
                            'rgba(239, 68, 68, 0.8)',
                            'rgba(168, 85, 247, 0.8)',
                        ],
                        borderWidth: 1,
                        borderColor: '#fff',
                    }],
                },
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading fullScreen text="Cargando estadísticas..." />;
    }

    return (
        <div>
            <Header 
                title="Estadísticas"
                subtitle="Análisis y tendencias del uso de chatbots de IA"
            />

            {error && (
                <Alert type="error" message={error} onClose={() => setError('')} className="mb-6" />
            )}

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                    title="Total Respuestas"
                    value={stats?.total_surveys || 0}
                    icon={BarChart3}
                    color="blue"
                />
                <StatsCard
                    title="Con Experiencia"
                    value={stats?.users_with_chatbot || 0}
                    icon={Users}
                    color="green"
                />
                <StatsCard
                    title="Promedio Calificación"
                    value={(stats?.avg_usefulness || 0).toFixed(1)}
                    icon={TrendingUp}
                    color="yellow"
                />
                <StatsCard
                    title="Recomendarían"
                    value={stats?.would_recommend || 0}
                    icon={PieChart}
                    color="purple"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Chart
                    type="bar"
                    data={chartData?.chatbots || {
                        labels: ['ChatGPT', 'Claude', 'Gemini', 'Copilot', 'Perplexity'],
                        datasets: [{
                            label: 'Uso de Chatbots',
                            data: [0, 0, 0, 0, 0],
                            backgroundColor: [
                                'rgba(59, 130, 246, 0.8)',
                                'rgba(16, 185, 129, 0.8)',
                                'rgba(251, 191, 36, 0.8)',
                                'rgba(239, 68, 68, 0.8)',
                                'rgba(168, 85, 247, 0.8)',
                            ],
                        }],
                    }}
                    title="Uso de Chatbots"
                    height={350}
                />
                <Chart
                    type="line"
                    data={chartData?.monthly || {
                        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                        datasets: [{
                            label: 'Encuestas por Mes',
                            data: [0, 0, 0, 0, 0, 0],
                            borderColor: 'rgb(59, 130, 246)',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            fill: true,
                        }],
                    }}
                    title="Tendencia de Respuestas"
                    height={350}
                />
            </div>
        </div>
    );
};

export default Statistics;