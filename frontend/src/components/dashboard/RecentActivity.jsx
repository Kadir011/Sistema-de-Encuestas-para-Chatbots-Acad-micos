import { Clock, FileText, CheckCircle, XCircle } from 'lucide-react';
import { formatRelativeDate } from '../../utils/formatters';

const RecentActivity = ({ activities = [], className = '' }) => {
    const getActivityIcon = (type) => {
        const icons = {
            survey_created: <FileText size={16} className="text-blue-600" />,
            survey_completed: <CheckCircle size={16} className="text-green-600" />,
            survey_deleted: <XCircle size={16} className="text-red-600" />,
            default: <Clock size={16} className="text-gray-600" />,
        };
        return icons[type] || icons.default;
    };

    return (
        <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Actividad Reciente
            </h3>
            
            {activities.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                    No hay actividad reciente
                </p>
            ) : (
                <div className="space-y-4">
                    {activities.map((activity, index) => (
                        <div 
                            key={index}
                            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex-shrink-0 mt-1">
                                {getActivityIcon(activity.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900">
                                    {activity.title}
                                </p>
                                {activity.description && (
                                    <p className="text-sm text-gray-600 mt-1">
                                        {activity.description}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    {formatRelativeDate(activity.timestamp)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecentActivity;
