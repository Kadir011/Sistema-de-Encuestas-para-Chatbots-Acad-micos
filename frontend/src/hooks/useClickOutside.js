import { useEffect, useRef } from 'react';

export const useClickOutside = (handler) => {
    const ref = useRef();

    useEffect(() => {
        const listener = (event) => {
            // No hacer nada si se hace clic dentro del elemento
            if (!ref.current || ref.current.contains(event.target)) {
                return;
            }
            handler(event);
        };

        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [handler]);

    return ref;
};