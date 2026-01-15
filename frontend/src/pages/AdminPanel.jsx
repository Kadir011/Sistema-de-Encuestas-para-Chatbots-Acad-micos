import { useEffect, useState } from 'react';
import StatsCard from '../components/dashboard/StatsCard';
import Chart from '../components/dashboard/Chart';
import RecentActivity from '../components/dashboard/RecentActivity';
import userService from '../services/userService';
import surveyService from '../services/surveyService';
import Button from '../components/common/Button';
import { Users, FileText, CheckCircle } from 'lucide-react';

const AdminPanel = () => {
	const [loading, setLoading] = useState(true);
	const [stats, setStats] = useState({
		users: 0,
		studentSurveys: 0,
		teacherSurveys: 0,
		completions: 0,
	});
	const [chartData, setChartData] = useState(null);
	const [activities, setActivities] = useState([]);


	const fetchStats = async () => {
		setLoading(true);
		try {
			const [userStats, allStudentSurveys, allTeacherSurveys] = await Promise.all([
				userService.getStatistics().catch(() => ({})),
				surveyService.student.getAll().catch(() => ({ surveys: [] })),
				surveyService.teacher.getAll().catch(() => ({ surveys: [] })),
			]);

			console.log('Admin fetchStats - Datos recibidos:', {
				userStats,
				allStudentSurveys,
				allTeacherSurveys
			});

			// Acceder a la estructura correcta del backend: response.statistics
			const userStatsData = userStats?.statistics || {};

			// Contar directamente desde los arrays para tiempo real
			const studentSurveysList = allStudentSurveys?.surveys || [];
			const teacherSurveysList = allTeacherSurveys?.surveys || [];

			// Asegurar que todos los valores sean números enteros, con 0 como default
			const totalUsers = parseInt(userStatsData?.total_users) || 0;
			const totalStudentSurveys = studentSurveysList.length;
			const totalTeacherSurveys = teacherSurveysList.length;

			// Contar completadas este mes
			const oneMonthAgo = new Date();
			oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
			
			const studentCompletions = studentSurveysList.filter(s => new Date(s.created_at) > oneMonthAgo).length;
			const teacherCompletions = teacherSurveysList.filter(s => new Date(s.created_at) > oneMonthAgo).length;

			setStats({
				users: totalUsers,
				studentSurveys: totalStudentSurveys,
				teacherSurveys: totalTeacherSurveys,
				completions: studentCompletions + teacherCompletions,
			});

			// Calcular datos por mes
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

			const studentMonthlyData = calculateMonthlyData(allStudentSurveys?.surveys || []);
			const teacherMonthlyData = calculateMonthlyData(allTeacherSurveys?.surveys || []);
			const allSurveysData = [
				...(allStudentSurveys?.surveys || []),
				...(allTeacherSurveys?.surveys || [])
			];
			const chatbotUsageData = calculateChatbotUsage(allSurveysData);
			
			console.log('Datos mensuales calculados:', { studentMonthlyData, teacherMonthlyData, chatbotUsageData });

			const labels = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

			setChartData({
				labels,
				chatbotLabels: ['ChatGPT', 'Claude', 'Gemini', 'Copilot', 'Perplexity'],
				chatbotUsage: chatbotUsageData,
				datasets: [
					{
						label: 'Encuestas Estudiantes',
						data: studentMonthlyData,
						borderColor: '#2563EB',
						backgroundColor: 'rgba(37,99,235,0.1)',
						borderWidth: 2,
						tension: 0.4,
						fill: true,
						pointRadius: 4,
						pointHoverRadius: 6,
						pointBackgroundColor: '#2563EB',
						pointBorderColor: '#fff',
						pointBorderWidth: 2,
					},
					{
						label: 'Encuestas Profesores',
						data: teacherMonthlyData,
						borderColor: '#10B981',
						backgroundColor: 'rgba(16,185,129,0.1)',
						borderWidth: 2,
						tension: 0.4,
						fill: true,
						pointRadius: 4,
						pointHoverRadius: 6,
						pointBackgroundColor: '#10B981',
						pointBorderColor: '#fff',
						pointBorderWidth: 2,
					},
				],
			});

			// Generar actividad reciente a partir de las encuestas
			const recentActivities = [];
			const allSurveys = [
				...(allStudentSurveys?.surveys || []).map(s => ({ ...s, type: 'student' })),
				...(allTeacherSurveys?.surveys || []).map(s => ({ ...s, type: 'teacher' }))
			];

			// Ordenar por fecha más reciente
			allSurveys.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

			// Tomar las últimas 5 encuestas
			allSurveys.slice(0, 5).forEach(survey => {
				recentActivities.push({
					title: survey.type === 'student' ? 'Encuesta de Estudiante Creada' : 'Encuesta de Profesor Creada',
					description: survey.title,
					type: 'survey_created',
					timestamp: survey.created_at
				});
			});

			setActivities(recentActivities);
		} catch (err) {
			console.error('Error al cargar estadísticas:', err);
			// No mostrar error al usuario, simplemente usar defaults
			setStats({
				users: 0,
				studentSurveys: 0,
				teacherSurveys: 0,
				completions: 0,
			});
			setChartData({
				labels: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
				datasets: [
					{
						label: 'Encuestas Estudiantes',
						data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
						borderColor: '#2563EB',
						backgroundColor: 'rgba(37,99,235,0.1)',
						borderWidth: 2,
						tension: 0.4,
						fill: true,
						pointRadius: 4,
						pointHoverRadius: 6,
						pointBackgroundColor: '#2563EB',
						pointBorderColor: '#fff',
						pointBorderWidth: 2,
					},
					{
						label: 'Encuestas Profesores',
						data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
						borderColor: '#10B981',
						backgroundColor: 'rgba(16,185,129,0.1)',
						borderWidth: 2,
						tension: 0.4,
						fill: true,
						pointRadius: 4,
						pointHoverRadius: 6,
						pointBackgroundColor: '#10B981',
						pointBorderColor: '#fff',
						pointBorderWidth: 2,
					},
				],
			});
			setActivities([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		// Cargar datos inmediatamente
		fetchStats();

		// Actualizar datos cada 5 segundos
		const interval = setInterval(fetchStats, 5000);

		// Limpiar el intervalo cuando el componente se desmonte
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="p-6">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-semibold">Panel de Administración</h1>
				<div className="flex items-center gap-2">
					<Button onClick={fetchStats}>Actualizar</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
				<StatsCard title="Usuarios" value={stats.users} icon={Users} color="indigo" />
				<StatsCard title="Encuestas (Estudiantes)" value={stats.studentSurveys} icon={FileText} color="blue" />
				<StatsCard title="Encuestas (Profesores)" value={stats.teacherSurveys} icon={FileText} color="green" />
				<StatsCard title="Completadas" value={stats.completions} icon={CheckCircle} color="purple" />
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
				<div className="lg:col-span-2">
					<Chart type="line" data={chartData || {
						labels: ['Ene','Feb','Mar','Abr'],
						datasets: [
							{ label: 'Estudiantes', data: [0,0,0,0], borderColor: '#2563EB', backgroundColor: 'rgba(37,99,235,0.08)', fill: true },
						],
					}} title="Tendencia de encuestas" height={320} />
				</div>

				<RecentActivity activities={activities} />
			</div>

			<div className="mt-6">
				<Chart 
					type="bar" 
					data={{
						labels: chartData?.chatbotLabels || ['ChatGPT', 'Claude', 'Gemini', 'Copilot', 'Perplexity'],
						datasets: [{
							label: 'Uso de Chatbots',
							data: chartData?.chatbotUsage || [0, 0, 0, 0, 0],
							backgroundColor: [
								'rgba(59, 130, 246, 0.8)',
								'rgba(16, 185, 129, 0.8)',
								'rgba(251, 191, 36, 0.8)',
								'rgba(239, 68, 68, 0.8)',
								'rgba(168, 85, 247, 0.8)',
							],
							borderWidth: 1,
							borderColor: '#fff',
						}]
					}}
					title="Uso de Chatbots" 
					height={300}
				/>
			</div>

			{loading && (
				<div className="text-center text-gray-500 mt-6">Cargando estadísticas...</div>
			)}
		</div>
	);
};

export default AdminPanel;