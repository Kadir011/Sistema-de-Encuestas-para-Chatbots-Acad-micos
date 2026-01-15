const Textarea = ({ 
    label,
    name,
    value,
    onChange,
    onBlur,
    error,
    touched,
    placeholder,
    required = false,
    disabled = false,
    rows = 4,
    className = '',
    ...props 
}) => {
    const hasError = touched && error;

    return (
        <div className={`mb-4 ${className}`}>
            {label && (
                <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <textarea
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                disabled={disabled}
                rows={rows}
                className={`
                    w-full px-3 py-2 border rounded-md shadow-sm resize-y
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    disabled:bg-gray-100 disabled:cursor-not-allowed
                    transition-colors duration-200
                    ${hasError ? 'border-red-500' : 'border-gray-300'}
                `}
                {...props}
            />
            {hasError && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};

export default Textarea;