const Radio = ({ 
    label,
    name,
    value,
    checked,
    onChange,
    disabled = false,
    className = '',
    ...props 
}) => {
    return (
        <div className={`flex items-center ${className}`}>
            <input
                id={`${name}-${value}`}
                name={name}
                type="radio"
                value={value}
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 disabled:opacity-50"
                {...props}
            />
            {label && (
                <label htmlFor={`${name}-${value}`} className="ml-2 block text-sm text-gray-700 cursor-pointer">
                    {label}
                </label>
            )}
        </div>
    );
};

export default Radio;