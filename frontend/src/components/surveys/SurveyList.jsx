import { useState } from 'react';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import SurveyCard from './SurveyCard';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import Pagination from '../common/Pagination';
import { usePagination } from '../../hooks/usePagination';
import { useDebounce } from '../../hooks/useDebounce';
import { filterBySearch, sortByField } from '../../utils/helpers';

const SurveyList = ({ surveys = [], onView, onEdit, onDelete, showActions = true }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [sortField, setSortField] = useState('created_at');
    const [sortOrder, setSortOrder] = useState('desc');
    const debouncedSearch = useDebounce(searchTerm, 300);

    // Filtrar encuestas
    let filteredSurveys = [...surveys];

    // Filtro por tipo
    if (filterType === 'student') {
        filteredSurveys = filteredSurveys.filter(s => s.tasks_used_for !== undefined);
    } else if (filterType === 'teacher') {
        filteredSurveys = filteredSurveys.filter(s => s.purposes !== undefined);
    } else if (filterType === 'with_experience') {
        filteredSurveys = filteredSurveys.filter(s => s.has_used_chatbot === true);
    } else if (filterType === 'without_experience') {
        filteredSurveys = filteredSurveys.filter(s => s.has_used_chatbot === false);
    }

    // Filtro por búsqueda
    if (debouncedSearch) {
        const searchFields = ['preferred_chatbot', 'chatbots_used', 'country'];
        filteredSurveys = filterBySearch(filteredSurveys, debouncedSearch, searchFields);
    }

    // Ordenamiento
    filteredSurveys = sortByField(filteredSurveys, sortField, sortOrder);

    // Paginación
    const {
        currentItems,
        currentPage,
        totalPages,
        goToPage,
    } = usePagination(filteredSurveys, 9);

    const toggleSort = () => {
        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    return (
        <div>
            {/* Búsqueda y filtros */}
            <div className="mb-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Input
                        placeholder="Buscar encuestas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        icon={<Search size={20} className="text-gray-400" />}
                    />
                    <Select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        options={[
                            { value: 'all', label: 'Todas las encuestas' },
                            { value: 'student', label: 'Solo estudiantes' },
                            { value: 'teacher', label: 'Solo profesores' },
                            { value: 'with_experience', label: 'Con experiencia' },
                            { value: 'without_experience', label: 'Sin experiencia' },
                        ]}
                    />
                    <div className="flex gap-2">
                        <Select
                            value={sortField}
                            onChange={(e) => setSortField(e.target.value)}
                            options={[
                                { value: 'created_at', label: 'Fecha de creación' },
                                { value: 'id', label: 'ID' },
                                { value: 'preferred_chatbot', label: 'Chatbot preferido' },
                                { value: 'usefulness_rating', label: 'Calificación' },
                            ]}
                            className="flex-1"
                        />
                        <Button
                            variant="outline"
                            onClick={toggleSort}
                            icon={sortOrder === 'asc' ? <SortAsc size={20} /> : <SortDesc size={20} />}
                        />
                    </div>
                </div>

                {/* Contador de resultados */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>
                        Mostrando {currentItems.length > 0 ? ((currentPage - 1) * 9) + 1 : 0} - {Math.min(currentPage * 9, filteredSurveys.length)} de {filteredSurveys.length} encuestas
                    </span>
                    {debouncedSearch && (
                        <span className="text-blue-600">
                            Filtrando por: "{debouncedSearch}"
                        </span>
                    )}
                </div>
            </div>

            {/* Lista de encuestas */}
            {currentItems.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow">
                    <div className="text-gray-400 mb-4">
                        <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <p className="text-lg font-medium text-gray-900 mb-1">No se encontraron encuestas</p>
                    <p className="text-sm text-gray-500">
                        {debouncedSearch ? 'Intenta con otro término de búsqueda' : 'Crea tu primera encuesta para empezar'}
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentItems.map((survey) => (
                            <SurveyCard
                                key={survey.id}
                                survey={survey}
                                onView={onView}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                showActions={showActions}
                            />
                        ))}
                    </div>

                    {/* Paginación */}
                    {totalPages > 1 && (
                        <div className="mt-8">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={goToPage}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default SurveyList;