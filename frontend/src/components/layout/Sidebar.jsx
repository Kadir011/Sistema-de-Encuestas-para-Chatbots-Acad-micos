import { Link, useLocation } from 'react-router-dom';
import { 
    Home, 
    FileText, 
    BarChart3, 
    Users, 
    Settings,
    X,
    ClipboardList,
    BookOpen
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();
    const { user, isAdmin, isTeacher, isStudent } = useAuth();

    const isActive = (path) => location.pathname === path;

    const menuItems = [
        {
            path: '/dashboard',
            icon: Home,
            label: 'Dashboard',
            roles: ['student', 'teacher', 'admin']
        },
        {
            path: '/student-survey',
            icon: ClipboardList,
            label: 'Encuesta Estudiante',
            roles: ['student', 'admin']
        },
        {
            path: '/teacher-survey',
            icon: BookOpen,
            label: 'Encuesta Profesor',
            roles: ['teacher', 'admin']
        },
        {
            path: '/my-surveys',
            icon: FileText,
            label: 'Mis Encuestas',
            roles: ['student', 'teacher', 'admin']
        },
        {
            path: '/statistics',
            icon: BarChart3,
            label: 'Estadísticas',
            roles: ['student', 'teacher', 'admin']
        },
        {
            path: '/admin',
            icon: Users,
            label: 'Panel Admin',
            roles: ['admin']
        },
        {
            path: '/users',
            icon: Users,
            label: 'Gestión de Usuarios',
            roles: ['admin']
        },
        {
            path: '/settings',
            icon: Settings,
            label: 'Configuración',
            roles: ['student', 'teacher', 'admin']
        },
    ];

    const filteredItems = menuItems.filter(item => 
        item.roles.includes(user?.role)
    );

    return (
        <>
            {/* Overlay para móvil */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out
                    lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:transform-none
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                {/* Header del sidebar */}
                <div className="flex items-center justify-between p-4 border-b lg:hidden">
                    <h2 className="text-lg font-semibold text-gray-900">Menú</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-md hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navegación */}
                <nav className="p-4 space-y-2">
                    {filteredItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={onClose}
                                className={`
                                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                                    ${active 
                                        ? 'bg-blue-50 text-blue-600 font-medium' 
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }
                                `}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;