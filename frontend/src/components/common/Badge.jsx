const Badge = ({ 
    children,
    variant = 'primary',
    size = 'md',
    className = '',
}) => {
    const variants = {
        primary: 'bg-blue-100 text-blue-900 font-semibold',
        success: 'bg-emerald-100 text-emerald-900 font-semibold',
        warning: 'bg-amber-100 text-amber-900 font-semibold',
        danger: 'bg-red-100 text-red-900 font-semibold',
        secondary: 'bg-slate-100 text-slate-900 font-semibold',
    };

    const sizes = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-2.5 py-0.5',
        lg: 'text-base px-3 py-1',
    };

    return (
        <span className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;