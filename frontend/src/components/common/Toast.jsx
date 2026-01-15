import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const Toast = ({ 
    id,
    message,
    type = 'info',
    duration = 3000,
    onClose,
}) => {
    const types = {
        success: {
            bg: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
            icon: <CheckCircle size={20} />,
        },
        error: {
            bg: 'bg-gradient-to-r from-red-500 to-red-600',
            icon: <XCircle size={20} />,
        },
        warning: {
            bg: 'bg-gradient-to-r from-amber-500 to-amber-600',
            icon: <AlertTriangle size={20} />,
        },
        info: {
            bg: 'bg-gradient-to-r from-blue-600 to-blue-700',
            icon: <Info size={20} />,
        },
    };

    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose(id);
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [id, duration, onClose]);

    const currentType = types[type];

    return (
        <div className={`${currentType.bg} text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 min-w-[300px] animate-slide-in`}>
            <div className="flex-shrink-0">
                {currentType.icon}
            </div>
            <p className="flex-1 text-sm font-medium">{message}</p>
            <button
                onClick={() => onClose(id)}
                className="flex-shrink-0 hover:opacity-70 transition-opacity"
            >
                <X size={20} />
            </button>
        </div>
    );
};

export default Toast;