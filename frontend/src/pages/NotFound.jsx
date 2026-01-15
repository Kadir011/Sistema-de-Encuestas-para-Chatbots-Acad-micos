import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { Home } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full text-center p-8 bg-white rounded-lg shadow">
                <h1 className="text-9xl font-bold text-blue-600 mb-4">404</h1>
                <h2 className="text-2xl font-semibold mb-2">Página no encontrada</h2>
                <p className="text-gray-600 mb-6">Lo sentimos, la página que buscas no existe o ha sido movida.</p>

                <div className="flex justify-center gap-3">
                    <Link to="/">
                        <Button className="flex items-center gap-2">
                            <Home size={16} />
                            Inicio
                        </Button>
                    </Link>

                    <Button onClick={() => window.history.back()} className="px-4">
                        Volver
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default NotFound;