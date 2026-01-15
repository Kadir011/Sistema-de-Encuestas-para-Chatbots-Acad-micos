const Checkbox = ({ 
    label,
    name,
    checked,
    onChange,
    disabled = false,
    className = '',
    ...props 
}) => {
    return (
        <div className={`flex items-center ${className}`}>
            <input
                id={name}
                name={name}
                type="checkbox"
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                {...props}
            />
            {label && (
                <label htmlFor={name} className="ml-2 block text-sm text-gray-700 cursor-pointer">
                    {label}
                </label>
            )}
        </div>
    );
};

export default Checkbox;