import { useState, useCallback } from 'react';

export const useForm = (initialValues = {}, validateFn = null) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Manejar cambios en inputs
    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        
        setValues(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Limpiar error del campo si existe
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    }, [errors]);

    // Manejar cambios en arrays (checkboxes múltiples)
    const handleArrayChange = useCallback((name, value, checked) => {
        setValues(prev => {
            const currentArray = prev[name] || [];
            
            if (checked) {
                return {
                    ...prev,
                    [name]: [...currentArray, value]
                };
            } else {
                return {
                    ...prev,
                    [name]: currentArray.filter(item => item !== value)
                };
            }
        });

        // Limpiar error del campo si existe
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    }, [errors]);

    // Manejar blur
    const handleBlur = useCallback((e) => {
        const { name } = e.target;
        
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));

        // Validar campo individual si existe función de validación
        if (validateFn) {
            const fieldErrors = validateFn({ ...values });
            if (fieldErrors[name]) {
                setErrors(prev => ({
                    ...prev,
                    [name]: fieldErrors[name]
                }));
            }
        }
    }, [values, validateFn]);

    // Setear valor manualmente
    const setValue = useCallback((name, value) => {
        setValues(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    // Setear múltiples valores
    const setMultipleValues = useCallback((newValues) => {
        setValues(prev => ({
            ...prev,
            ...newValues
        }));
    }, []);

    // Resetear formulario
    const reset = useCallback((newValues = initialValues) => {
        setValues(newValues);
        setErrors({});
        setTouched({});
        setIsSubmitting(false);
    }, [initialValues]);

    // Validar formulario
    const validate = useCallback(() => {
        if (!validateFn) return true;

        const validationErrors = validateFn(values);
        setErrors(validationErrors);

        return Object.keys(validationErrors).length === 0;
    }, [values, validateFn]);

    // Manejar submit
    const handleSubmit = useCallback((onSubmit) => {
        return async (e) => {
            e.preventDefault();
            
            setIsSubmitting(true);

            // Marcar todos los campos como tocados
            const allTouched = Object.keys(values).reduce((acc, key) => {
                acc[key] = true;
                return acc;
            }, {});
            setTouched(allTouched);

            // Validar
            if (!validate()) {
                setIsSubmitting(false);
                return;
            }

            try {
                await onSubmit(values);
            } catch (error) {
                console.error('Error en submit:', error);
            } finally {
                setIsSubmitting(false);
            }
        };
    }, [values, validate]);

    return {
        values,
        errors,
        touched,
        isSubmitting,
        handleChange,
        handleArrayChange,
        handleBlur,
        handleSubmit,
        setValue,
        setMultipleValues,
        setErrors,
        reset,
        validate,
    };
};