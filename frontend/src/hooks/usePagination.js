import { useState, useMemo } from 'react';

export const usePagination = (items, itemsPerPage = 10) => {
    const [currentPage, setCurrentPage] = useState(1);

    // Calcular total de páginas
    const totalPages = useMemo(() => {
        return Math.ceil(items.length / itemsPerPage);
    }, [items.length, itemsPerPage]);

    // Obtener items de la página actual
    const currentItems = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return items.slice(startIndex, endIndex);
    }, [items, currentPage, itemsPerPage]);

    // Ir a página específica
    const goToPage = (page) => {
        const pageNumber = Math.max(1, Math.min(page, totalPages));
        setCurrentPage(pageNumber);
    };

    // Página siguiente
    const nextPage = () => {
        goToPage(currentPage + 1);
    };

    // Página anterior
    const prevPage = () => {
        goToPage(currentPage - 1);
    };

    // Resetear a primera página
    const reset = () => {
        setCurrentPage(1);
    };

    return {
        currentPage,
        totalPages,
        currentItems,
        goToPage,
        nextPage,
        prevPage,
        reset,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1,
    };
};