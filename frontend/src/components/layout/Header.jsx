import { useAuth } from '../../hooks/useAuth';
import { formatRole } from '../../utils/formatters';

const Header = ({ title, subtitle }) => {
    const { user } = useAuth();

    return (
        <div className="bg-white shadow-sm border-b border-gray-200 mb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="mt-1 text-sm text-gray-600">
                                {subtitle}
                            </p>
                        )}
                    </div>
                    {user && (
                        <div className="hidden md:block">
                            <div className="bg-blue-50 px-4 py-2 rounded-lg">
                                <p className="text-sm text-gray-600">Bienvenido,</p>
                                <p className="font-semibold text-gray-900">
                                    {user.username}
                                </p>
                                <p className="text-xs text-blue-600">
                                    {formatRole(user.role)}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;