const Card = ({ 
    children,
    title,
    subtitle,
    footer,
    hover = false,
    className = '',
    ...props 
}) => {
    return (
        <div 
            className={`
                bg-white rounded-lg shadow-md overflow-hidden
                ${hover ? 'hover:shadow-lg transition-shadow duration-200' : ''}
                ${className}
            `}
            {...props}
        >
            {(title || subtitle) && (
                <div className="px-6 py-4 border-b border-gray-200">
                    {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
                    {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
                </div>
            )}
            <div className="px-6 py-4">
                {children}
            </div>
            {footer && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    {footer}
                </div>
            )}
        </div>
    );
};

export default Card;