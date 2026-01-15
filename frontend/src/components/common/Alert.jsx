import { AlertCircle, CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const Alert = ({ 
    type = 'info',
    title,
    message,
    onClose,
    className = '',
}) => {
    const types = {
        success: {
            bg: 'bg-green-50',
            border: 'border-green-200',
            text: 'text-green-800',
            icon: <CheckCircle className="text-green-500" size={20} />,
        },
        error: {
            bg: 'bg-red-50',
            border: 'border-red-200',
            text: 'text-red-800',
            icon: <XCircle className="text-red-500" size={20} />,
        },
        warning: {
            bg: 'bg-yellow-50',
            border: 'border-yellow-200',
            text: 'text-yellow-800',
            icon: <AlertTriangle className="text-yellow-500" size={20} />,
        },
        info: {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            text: 'text-blue-800',
            icon: <Info className="text-blue-500" size={20} />,
        },
    };

    const currentType = types[type];

    return (
        <div className={`${currentType.bg} ${currentType.border} border rounded-lg p-4 ${className}`}>
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    {currentType.icon}
                </div>
                <div className="ml-3 flex-1">
                    {title && (
                        <h3 className={`text-sm font-semibold ${currentType.text}`}>
                            {title}
                        </h3>
                    )}
                    {message && (
                        <p className={`text-sm ${currentType.text} ${title ? 'mt-1' : ''}`}>
                            {message}
                        </p>
                    )}
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className={`ml-3 flex-shrink-0 ${currentType.text} hover:opacity-70`}
                    >
                        <X size={20} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default Alert;