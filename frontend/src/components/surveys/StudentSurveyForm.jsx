import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';
import { validateStudentSurvey } from '../../utils/validators';
import surveyService from '../../services/surveyService';
import {
    CHATBOTS,
    USAGE_FREQUENCY,
    STUDENT_TASKS,
    EFFECTIVENESS_COMPARISON,
} from '../../utils/constants';
import Input from '../common/Input';
import Select from '../common/Select';
import Checkbox from '../common/Checkbox';
import Radio from '../common/Radio';
import Textarea from '../common/Textarea';
import Button from '../common/Button';
import Alert from '../common/Alert';
import Card from '../common/Card';

const StudentSurveyForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const {
        values,
        errors,
        touched,
        handleChange,
        handleArrayChange,
        handleBlur,
        handleSubmit,
        setValue,
    } = useForm(
        {
            has_used_chatbot: null,
            chatbots_used: [],
            usage_frequency: '',
            usefulness_rating: '',
            tasks_used_for: [],
            overall_experience: '',
            preferred_chatbot: '',
            effectiveness_comparison: '',
            will_continue_using: null,
            would_recommend: null,
            additional_comments: '',
        },
        validateStudentSurvey
    );

    const onSubmit = async (formData) => {
        try {
            setLoading(true);
            setError('');
            await surveyService.student.create(formData);
            setSuccess('¡Encuesta creada exitosamente!');
            setTimeout(() => navigate('/my-surveys'), 2000);
        } catch (err) {
            setError(err.message || 'Error al crear la encuesta');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <Card title="Encuesta para Estudiantes" subtitle="Comparte tu experiencia usando chatbots de IA">
                {error && (
                    <Alert type="error" message={error} onClose={() => setError('')} className="mb-6" />
                )}
                {success && (
                    <Alert type="success" message={success} className="mb-6" />
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Pregunta 1: ¿Has usado chatbots? */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            1. ¿Has usado chatbots de IA para ayudarte en tus estudios? *
                        </label>
                        <div className="space-y-2">
                            <Radio
                                label="Sí"
                                name="has_used_chatbot"
                                value="true"
                                checked={values.has_used_chatbot === true}
                                onChange={() => setValue('has_used_chatbot', true)}
                            />
                            <Radio
                                label="No"
                                name="has_used_chatbot"
                                value="false"
                                checked={values.has_used_chatbot === false}
                                onChange={() => setValue('has_used_chatbot', false)}
                            />
                        </div>
                        {touched.has_used_chatbot && errors.has_used_chatbot && (
                            <p className="mt-1 text-sm text-red-600">{errors.has_used_chatbot}</p>
                        )}
                    </div>

                    {/* Preguntas condicionales si ha usado chatbots */}
                    {values.has_used_chatbot === true && (
                        <>
                            {/* Pregunta 2: ¿Qué chatbots has usado? */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    2. ¿Qué chatbots de IA has usado? (Selecciona todos los que apliquen) *
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {CHATBOTS.map((chatbot) => (
                                        <Checkbox
                                            key={chatbot}
                                            label={chatbot}
                                            name="chatbots_used"
                                            checked={values.chatbots_used?.includes(chatbot)}
                                            onChange={(e) => handleArrayChange('chatbots_used', chatbot, e.target.checked)}
                                        />
                                    ))}
                                </div>
                                {touched.chatbots_used && errors.chatbots_used && (
                                    <p className="mt-1 text-sm text-red-600">{errors.chatbots_used}</p>
                                )}
                            </div>

                            {/* Pregunta 3: Frecuencia de uso */}
                            <Select
                                label="3. ¿Con qué frecuencia usas chatbots de IA?"
                                name="usage_frequency"
                                value={values.usage_frequency}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={errors.usage_frequency}
                                touched={touched.usage_frequency}
                                options={USAGE_FREQUENCY}
                            />

                            {/* Pregunta 4: Calificación de utilidad */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    4. ¿Qué tan útiles te parecen los chatbots de IA? (1-5)
                                </label>
                                <div className="flex space-x-4">
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                        <Radio
                                            key={rating}
                                            label={rating.toString()}
                                            name="usefulness_rating"
                                            value={rating.toString()}
                                            checked={values.usefulness_rating === rating.toString()}
                                            onChange={handleChange}
                                        />
                                    ))}
                                </div>
                                <div className="flex justify-between mt-1 text-xs text-gray-500">
                                    <span>Poco útil</span>
                                    <span>Muy útil</span>
                                </div>
                            </div>

                            {/* Pregunta 5: Tareas */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    5. ¿Para qué tareas usas los chatbots? (Selecciona todas las que apliquen) *
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {STUDENT_TASKS.map((task) => (
                                        <Checkbox
                                            key={task}
                                            label={task}
                                            name="tasks_used_for"
                                            checked={values.tasks_used_for?.includes(task)}
                                            onChange={(e) => handleArrayChange('tasks_used_for', task, e.target.checked)}
                                        />
                                    ))}
                                </div>
                                {touched.tasks_used_for && errors.tasks_used_for && (
                                    <p className="mt-1 text-sm text-red-600">{errors.tasks_used_for}</p>
                                )}
                            </div>

                            {/* Pregunta 6: Experiencia general */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    6. ¿Cómo calificarías tu experiencia general? (1-5)
                                </label>
                                <div className="flex space-x-4">
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                        <Radio
                                            key={rating}
                                            label={rating.toString()}
                                            name="overall_experience"
                                            value={rating.toString()}
                                            checked={values.overall_experience === rating.toString()}
                                            onChange={handleChange}
                                        />
                                    ))}
                                </div>
                                <div className="flex justify-between mt-1 text-xs text-gray-500">
                                    <span>Muy mala</span>
                                    <span>Excelente</span>
                                </div>
                            </div>

                            {/* Pregunta 7: Chatbot preferido */}
                            <Select
                                label="7. ¿Cuál es tu chatbot preferido? *"
                                name="preferred_chatbot"
                                value={values.preferred_chatbot}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={errors.preferred_chatbot}
                                touched={touched.preferred_chatbot}
                                options={CHATBOTS}
                                required
                            />

                            {/* Pregunta 8: Comparación con Google */}
                            <Select
                                label="8. En comparación con buscar en Google, los chatbots son:"
                                name="effectiveness_comparison"
                                value={values.effectiveness_comparison}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                options={EFFECTIVENESS_COMPARISON}
                            />

                            {/* Pregunta 9: ¿Continuarás usando? */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    9. ¿Continuarás usando chatbots de IA en tus estudios?
                                </label>
                                <div className="space-y-2">
                                    <Radio
                                        label="Sí"
                                        name="will_continue_using"
                                        value="true"
                                        checked={values.will_continue_using === true}
                                        onChange={() => setValue('will_continue_using', true)}
                                    />
                                    <Radio
                                        label="No"
                                        name="will_continue_using"
                                        value="false"
                                        checked={values.will_continue_using === false}
                                        onChange={() => setValue('will_continue_using', false)}
                                    />
                                </div>
                            </div>

                            {/* Pregunta 10: ¿Recomendarías? */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    10. ¿Recomendarías los chatbots a otros estudiantes?
                                </label>
                                <div className="space-y-2">
                                    <Radio
                                        label="Sí"
                                        name="would_recommend"
                                        value="true"
                                        checked={values.would_recommend === true}
                                        onChange={() => setValue('would_recommend', true)}
                                    />
                                    <Radio
                                        label="No"
                                        name="would_recommend"
                                        value="false"
                                        checked={values.would_recommend === false}
                                        onChange={() => setValue('would_recommend', false)}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Comentarios adicionales */}
                    <Textarea
                        label="Comentarios adicionales (opcional)"
                        name="additional_comments"
                        value={values.additional_comments}
                        onChange={handleChange}
                        placeholder="Comparte cualquier otro pensamiento o sugerencia..."
                        rows={4}
                    />

                    {/* Botones */}
                    <div className="flex justify-end space-x-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/dashboard')}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            loading={loading}
                        >
                            Enviar Encuesta
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default StudentSurveyForm;