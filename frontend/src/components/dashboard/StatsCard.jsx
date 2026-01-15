import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ 
    title, 
    value, 
    icon: Icon, 
    trend = null,
    trendLabel = '',
    color = 'blue',
    className = '' 
}) => {
    const colors = {
        blue: 'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700',
        green: 'bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-700',
        yellow: 'bg-gradient-to-br from-amber-50 to-amber-100 text-amber-700',
        red: 'bg-gradient-to-br from-red-50 to-red-100 text-red-700',
        purple: 'bg-gradient-to-br from-purple-50 to-purple-100 text-purple-700',
        indigo: 'bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-700',
    };

    const isPositiveTrend = trend && trend > 0;
    const isNegativeTrend = trend && trend < 0;

    return (
        <div className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${className}`}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                    
                    {trend !== null && (
                        <div className="flex items-center mt-2">
                            {isPositiveTrend && <TrendingUp size={16} className="text-green-600 mr-1" />}
                            {isNegativeTrend && <TrendingDown size={16} className="text-red-600 mr-1" />}
                            <span className={`text-sm font-medium ${
                                isPositiveTrend ? 'text-green-600' : 
                                isNegativeTrend ? 'text-red-600' : 
                                'text-gray-600'
                            }`}>
                                {trend > 0 ? '+' : ''}{trend}%
                            </span>
                            {trendLabel && (
                                <span className="text-sm text-gray-500 ml-1">
                                    {trendLabel}
                                </span>
                            )}
                        </div>
                    )}
                </div>
                
                {Icon && (
                    <div className={`${colors[color]} p-3 rounded-lg`}>
                        <Icon size={24} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatsCard;