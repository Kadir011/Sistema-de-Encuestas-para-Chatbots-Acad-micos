import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, BookOpen, ArrowRight, ChevronLeft } from 'lucide-react';

const RoleSelection = () => {
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
        setIsAnimating(true);

        // Esperar a que termine la animación antes de navegar
        setTimeout(() => {
            navigate(`/register/${role}`);
        }, 600);
    };

    const roles = [
        {
            id: 'student',
            title: 'Estudiante',
            description: 'Comparte tu experiencia usando chatbots de IA en tus estudios.',
            icon: GraduationCap,
            color: 'from-blue-500 to-blue-600',
            borderColor: 'border-blue-500',
            bgLight: 'bg-blue-50',
            textColor: 'text-blue-600',
            accentColor: 'blue'
        },
        {
            id: 'teacher',
            title: 'Docente',
            description: 'Participa contando cómo utilizas chatbots en tu práctica docente.',
            icon: BookOpen,
            color: 'from-emerald-500 to-emerald-600',
            borderColor: 'border-emerald-500',
            bgLight: 'bg-emerald-50',
            textColor: 'text-emerald-600',
            accentColor: 'emerald'
        },
    ];

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="max-w-5xl w-full">
                {/* Botón Volver */}
                <div className="mb-8">
                    <Link to="/" className="inline-flex items-center text-gray-500 hover:text-blue-600 transition-colors">
                        <ChevronLeft size={20} />
                        <span>Volver al inicio</span>
                    </Link>
                </div>

                {/* Header */}
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        ¿Cómo deseas registrarte?
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Selecciona tu perfil para crear una cuenta personalizada y comenzar a participar en las encuestas.
                    </p>
                </div>

                {/* Role Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {roles.map((role, index) => {
                        const Icon = role.icon;
                        const isSelected = selectedRole === role.id;

                        return (
                            <div
                                key={role.id}
                                onClick={() => !isAnimating && handleRoleSelect(role.id)}
                                className={`
                                    group relative bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer
                                    transform transition-all duration-500 ease-out
                                    hover:scale-105 hover:shadow-2xl
                                    ${isSelected ? 'scale-105 shadow-2xl ring-4 ring-offset-4' : ''}
                                    ${isSelected ? (role.id === 'student' ? 'ring-blue-500' : 'ring-emerald-500') : ''}
                                    ${isAnimating && isSelected ? 'animate-pulse' : ''}
                                `}
                                style={{
                                    animationDelay: `${index * 100}ms`,
                                    animation: !isAnimating ? `slide-up 0.6s ease-out ${index * 100}ms both` : undefined
                                }}
                            >
                                {/* Fondo con gradiente sutil al hacer hover */}
                                <div className={`
                                    absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 
                                    group-hover:opacity-5 transition-opacity duration-300
                                    ${isSelected ? 'opacity-10' : ''}
                                `} />

                                <div className="relative p-8">
                                    {/* Icono */}
                                    <div className={`
                                        w-20 h-20 rounded-2xl ${role.bgLight} flex items-center justify-center mb-6
                                        transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3
                                        ${isSelected ? 'scale-110 rotate-3' : ''}
                                    `}>
                                        <Icon size={40} className={role.textColor} />
                                    </div>

                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                        {role.title}
                                    </h3>

                                    <p className="text-gray-600 mb-6 leading-relaxed">
                                        {role.description}
                                    </p>

                                    <ul className="space-y-3 mb-8">
                                        {['Encuestas personalizadas', 'Dashboard con estadísticas', 'Contribuye a la investigación'].map((benefit, i) => (
                                            <li key={i} className="flex items-center text-sm text-gray-600">
                                                <div className={`w-2 h-2 rounded-full bg-${role.accentColor}-500 mr-3`} />
                                                {benefit}
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Botón Visual */}
                                    <div className={`
                                        flex items-center justify-between p-4 rounded-xl border-2 ${role.borderColor}
                                        transition-all duration-300 group-hover:bg-gradient-to-r ${role.color}
                                        group-hover:text-white group-hover:border-transparent
                                        ${isSelected ? `bg-gradient-to-r ${role.color} text-white border-transparent` : 'bg-white text-gray-700'}
                                    `}>
                                        <span className="font-semibold">
                                            {isSelected ? 'Redirigiendo...' : `Continuar como ${role.title}`}
                                        </span>
                                        <ArrowRight
                                            size={20}
                                            className={`transform transition-transform duration-300 group-hover:translate-x-1 ${isSelected ? 'translate-x-1' : ''}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="text-center text-gray-500">
                    ¿Ya tienes una cuenta? {' '}
                    <Link to="/login" className="text-blue-600 font-semibold hover:underline">Inicia sesión</Link>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 0.8s ease-out both;
                }
            `}} />
        </div>
    );
};

export default RoleSelection;