import { Link } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';
import { useState, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useClickOutside } from '../../hooks/useClickOutside';
import { formatRole } from '../../utils/formatters';

const Navbar = ({ onMenuClick }) => {
    const { user, logout, isAuthenticated } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const userMenuRef = useClickOutside(() => setShowUserMenu(false));

    const handleLogout = async () => {
        await logout();
        setShowUserMenu(false);
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo y menú hamburguesa */}
                    <div className="flex items-center">
                        <button
                            onClick={onMenuClick}
                            className="p-2 rounded-md text-gray-600 hover:bg-gray-100 lg:hidden"
                        >
                            <Menu size={24} />
                        </button>
                        <Link to="/" className="flex items-center ml-2 lg:ml-0">
                            <span className="text-2xl font-bold text-blue-600">
                                ChatBot Survey
                            </span>
                        </Link>
                    </div>

                    {/* Enlaces de navegación */}
                    {isAuthenticated && (
                        <div className="hidden md:flex items-center space-x-6">
                            <Link
                                to="/dashboard"
                                className="text-gray-700 hover:text-blue-600 transition-colors"
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/my-surveys"
                                className="text-gray-700 hover:text-blue-600 transition-colors"
                            >
                                Mis Encuestas
                            </Link>
                            <Link
                                to="/statistics"
                                className="text-gray-700 hover:text-blue-600 transition-colors"
                            >
                                Estadísticas
                            </Link>
                        </div>
                    )}

                    {/* Usuario */}
                    <div className="flex items-center">
                        {isAuthenticated ? (
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 transition-colors"
                                >
                                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                        {user?.username?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="hidden md:block text-left">
                                        <p className="text-sm font-medium text-gray-900">
                                            {user?.username}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {formatRole(user?.role)}
                                        </p>
                                    </div>
                                </button>

                                {/* Menú desplegable */}
                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200">
                                        <Link
                                            to="/profile"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <User size={16} className="mr-2" />
                                            Perfil
                                        </Link>
                                        <Link
                                            to="/settings"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <Settings size={16} className="mr-2" />
                                            Configuración
                                        </Link>
                                        <hr className="my-1" />
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                        >
                                            <LogOut size={16} className="mr-2" />
                                            Cerrar Sesión
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/login"
                                    className="text-gray-700 hover:text-blue-600 transition-colors"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-2 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-md hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all"
                                >
                                    Registrarse
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;