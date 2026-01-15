import { Calendar, Edit, Trash2, Eye } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import Badge from '../common/Badge';
import Button from '../common/Button';

const SurveyCard = ({ survey, onView, onEdit, onDelete, showActions = true }) => {
    const getSurveyType = () => {
        // Detectar tipo de encuesta basándose en los campos
        if (survey.tasks_used_for !== undefined) {
            return { type: 'Estudiante', color: 'primary' };
        }
        if (survey.purposes !== undefined) {
            return { type: 'Profesor', color: 'success' };
        }
        return { type: 'General', color: 'secondary' };
    };

    const surveyInfo = getSurveyType();

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <Badge variant={surveyInfo.color} className="mb-2">
                        {surveyInfo.type}
                    </Badge>
                    <h3 className="text-lg font-semibold text-gray-900">
                        Encuesta #{survey.id}
                    </h3>
                </div>
                {survey.has_used_chatbot && (
                    <Badge variant="success" size="sm">
                        Con experiencia
                    </Badge>
                )}
            </div>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
                {survey.chatbots_used && survey.chatbots_used.length > 0 && (
                    <p>
                        <strong className="text-gray-900">Chatbots:</strong>{' '}
                        {Array.isArray(survey.chatbots_used) 
                            ? survey.chatbots_used.slice(0, 3).join(', ') + (survey.chatbots_used.length > 3 ? '...' : '')
                            : survey.chatbots_used}
                    </p>
                )}
                {survey.preferred_chatbot && (
                    <p>
                        <strong className="text-gray-900">Preferido:</strong> {survey.preferred_chatbot}
                    </p>
                )}
                {survey.usefulness_rating && (
                    <p>
                        <strong className="text-gray-900">Calificación:</strong>{' '}
                        {'⭐'.repeat(parseInt(survey.usefulness_rating))} ({survey.usefulness_rating}/5)
                    </p>
                )}
                {survey.overall_experience && (
                    <p>
                        <strong className="text-gray-900">Experiencia:</strong>{' '}
                        {'⭐'.repeat(parseInt(survey.overall_experience))} ({survey.overall_experience}/5)
                    </p>
                )}
                {survey.likelihood_future_use && (
                    <p>
                        <strong className="text-gray-900">Uso futuro:</strong> {survey.likelihood_future_use}
                    </p>
                )}
                {survey.country && (
                    <p>
                        <strong className="text-gray-900">País:</strong> {survey.country}
                    </p>
                )}
            </div>

            <div className="flex items-center text-xs text-gray-500 mb-4">
                <Calendar size={14} className="mr-1" />
                <span>{formatDate(survey.created_at)}</span>
            </div>

            {showActions && (
                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onView(survey)}
                        icon={<Eye size={16} />}
                    >
                        Ver
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onEdit(survey)}
                        icon={<Edit size={16} />}
                    >
                        Editar
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDelete(survey)}
                        icon={<Trash2 size={16} />}
                        className="text-red-600 hover:bg-red-50"
                    >
                        Eliminar
                    </Button>
                </div>
            )}
        </div>
    );
};

export default SurveyCard;