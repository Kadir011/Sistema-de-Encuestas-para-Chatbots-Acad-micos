import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { BarChart3, Users, FileText, CheckCircle } from 'lucide-react';
import Button from '../components/common/Button';

const Home = () => {
    const { isAuthenticated } = useAuth();

    const features = [
        {
            icon: FileText,
            title: 'Encuestas Personalizadas',
            description: 'Formularios específicos para estudiantes y profesores sobre el uso de chatbots de IA.',
        },
        {
            icon: BarChart3,
            title: 'Análisis en Tiempo Real',
            description: 'Visualiza estadísticas y tendencias del uso de chatbots en la educación.',
        },
        {
            icon: Users,
            title: 'Múltiples Roles',
            description: 'Plataforma diseñada para estudiantes, profesores y administradores.',
        },
        {
            icon: CheckCircle,
            title: 'Fácil de Usar',
            description: 'Interfaz intuitiva y sencilla para completar encuestas en minutos.',
        },
    ];

    const stats = [
        { value: '1000+', label: 'Encuestas Completadas' },
        { value: '500+', label: 'Usuarios Activos' },
        { value: '8', label: 'Chatbots Analizados' },
        { value: '95%', label: 'Satisfacción' },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
                            ChatBot Survey Platform
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
                            Descubre cómo los estudiantes y profesores están usando chatbots de IA en la educación
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            {isAuthenticated ? (
                                <Link to="/dashboard">
                                    <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                                        Ir al Dashboard
                                    </Button>
                                </Link>
                            ) : (
                                <>
                                    <Link to="/register">
                                        <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-100 w-full sm:w-auto">
                                            Comenzar Ahora
                                        </Button>
                                    </Link>
                                    <Link to="/login">
                                        <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-700 w-full sm:w-auto">
                                            Iniciar Sesión
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <p className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</p>
                                <p className="text-gray-600">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            ¿Por qué usar nuestra plataforma?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Herramientas diseñadas para facilitar la recopilación y análisis de datos sobre chatbots educativos
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={index}
                                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
                                >
                                    <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                        <Icon className="text-blue-600" size={24} />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-blue-600 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold mb-6">
                        ¿Listo para compartir tu experiencia?
                    </h2>
                    <p className="text-xl mb-8 text-blue-100">
                        Únete a cientos de estudiantes y profesores que ya están participando
                    </p>
                    {!isAuthenticated && (
                        <Link to="/register">
                            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                                Registrarse Gratis
                            </Button>
                        </Link>
                    )}
                </div>
            </section>
        </div>
    );
}

export default Home;