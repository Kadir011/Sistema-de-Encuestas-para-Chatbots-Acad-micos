import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
    // Obtener valor inicial del localStorage
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error('Error al leer localStorage:', error);
            return initialValue;
        }
    });

    // Guardar en localStorage cuando cambie el valor
    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error('Error al guardar en localStorage:', error);
        }
    };

    // Remover del localStorage
    const removeValue = () => {
        try {
            window.localStorage.removeItem(key);
            setStoredValue(initialValue);
        } catch (error) {
            console.error('Error al remover de localStorage:', error);
        }
    };

    return [storedValue, setValue, removeValue];
};