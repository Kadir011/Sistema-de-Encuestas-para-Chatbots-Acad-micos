import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';
import { validateTeacherSurvey } from '../../utils/validators';
import surveyService from '../../services/surveyService';
import {
    CHATBOTS,
    TEACHER_PURPOSES,
    TEACHER_OUTCOMES,
    TEACHER_CHALLENGES,
    FUTURE_USE_LIKELIHOOD,
    TEACHER_ADVANTAGES,
    TEACHER_CONCERNS,
    RESOURCES_NEEDED,
    AGE_RANGES,
    INSTITUTION_TYPES,
    YEARS_EXPERIENCE,
} from '../../utils/constants';
import Input from '../common/Input';
import Select from '../common/Select';
import Checkbox from '../common/Checkbox';
import Radio from '../common/Radio';
import Textarea from '../common/Textarea';
import Button from '../common/Button';
import Alert from '../common/Alert';
import Card from '../common/Card';

const TeacherSurveyForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [coursesInputValue, setCoursesInputValue] = useState('');

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
            courses_used: [],
            purposes: [],
            outcomes: [],
            challenges: [],
            likelihood_future_use: '',
            advantages: [],
            concerns: [],
            resources_needed: [],
            would_recommend: null,
            age_range: '',
            institution_type: '',
            country: '',
            years_experience: '',
            additional_comments: '',
        },
        validateTeacherSurvey
    );

    const onSubmit = async (formData) => {
        try {
            setLoading(true);
            setError('');
            // Convertir cursos de string a array en el submit
            const dataToSend = {
                ...formData,
                courses_used: coursesInputValue
                    .split(',')
                    .map(c => c.trim())
                    .filter(c => c.length > 0)
            };
            
            // Validar que haya al menos un curso
            if (dataToSend.courses_used.length === 0) {
                setError('Por favor, ingresa al menos un curso o asignatura');
                return;
            }
            
            await surveyService.teacher.create(dataToSend);
            setSuccess('¡Encuesta creada exitosamente!');
            setTimeout(() => navigate('/my-surveys'), 2000);
        } catch (err) {
            setError(err.message || 'Error al crear la encuesta');
        } finally {
            setLoading(false);
        }
    };

    const handleCoursesChange = (e) => {
        const value = e.target.value;
        setCoursesInputValue(value);
        // También actualizar el array en values para el validador
        const coursesArray = value
            .split(',')
            .map(c => c.trim())
            .filter(c => c.length > 0);
        setValue('courses_used', coursesArray);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <Card title="Encuesta para Profesores" subtitle="Comparte tu experiencia usando chatbots de IA en la enseñanza">
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
                            1. ¿Has usado chatbots de IA en tu práctica docente? *
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

                    {values.has_used_chatbot === true && (
                        <>
                            {/* Pregunta 2: Chatbots usados */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    2. ¿Qué chatbots has usado? (Selecciona todos los que apliquen) *
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

                            {/* Pregunta 3: Cursos */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    3. ¿En qué cursos o asignaturas los has usado? (separados por coma) *
                                </label>
                                <input
                                    type="text"
                                    value={coursesInputValue}
                                    onChange={handleCoursesChange}
                                    placeholder="Ej: Matemáticas, Ciencias, Literatura, Historia..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Escribe los cursos separados por comas. Los espacios se ignorarán automáticamente.
                                </p>
                                {coursesInputValue && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {coursesInputValue
                                            .split(',')
                                            .map(c => c.trim())
                                            .filter(c => c.length > 0)
                                            .map((course, idx) => (
                                                <span key={idx} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                                                    {course}
                                                </span>
                                            ))
                                        }
                                    </div>
                                )}
                                {touched.courses_used && errors.courses_used && (
                                    <p className="mt-1 text-sm text-red-600">{errors.courses_used}</p>
                                )}
                            </div>

                            {/* Pregunta 4: Propósitos */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    4. ¿Para qué propósitos los has usado? (Selecciona todos los que apliquen) *
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {TEACHER_PURPOSES.map((purpose) => (
                                        <Checkbox
                                            key={purpose}
                                            label={purpose}
                                            name="purposes"
                                            checked={values.purposes?.includes(purpose)}
                                            onChange={(e) => handleArrayChange('purposes', purpose, e.target.checked)}
                                        />
                                    ))}
                                </div>
                                {touched.purposes && errors.purposes && (
                                    <p className="mt-1 text-sm text-red-600">{errors.purposes}</p>
                                )}
                            </div>

                            {/* Pregunta 5: Resultados */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    5. ¿Qué resultados has obtenido? (Selecciona todos los que apliquen)
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {TEACHER_OUTCOMES.map((outcome) => (
                                        <Checkbox
                                            key={outcome}
                                            label={outcome}
                                            name="outcomes"
                                            checked={values.outcomes?.includes(outcome)}
                                            onChange={(e) => handleArrayChange('outcomes', outcome, e.target.checked)}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Pregunta 6: Desafíos */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    6. ¿Qué desafíos has enfrentado? (Selecciona todos los que apliquen)
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {TEACHER_CHALLENGES.map((challenge) => (
                                        <Checkbox
                                            key={challenge}
                                            label={challenge}
                                            name="challenges"
                                            checked={values.challenges?.includes(challenge)}
                                            onChange={(e) => handleArrayChange('challenges', challenge, e.target.checked)}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Pregunta 7: Uso futuro */}
                            <Select
                                label="7. ¿Qué tan probable es que continúes usando chatbots en el futuro?"
                                name="likelihood_future_use"
                                value={values.likelihood_future_use}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                options={FUTURE_USE_LIKELIHOOD}
                            />

                            {/* Pregunta 8: ¿Recomendarías? */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    8. ¿Recomendarías el uso de chatbots de IA a otros docentes?
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

                            {/* Pregunta 9: Ventajas */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    9. ¿Qué ventajas ves en el uso de chatbots en la educación? (Selecciona todas las que apliquen)
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {TEACHER_ADVANTAGES.map((advantage) => (
                                        <Checkbox
                                            key={advantage}
                                            label={advantage}
                                            name="advantages"
                                            checked={values.advantages?.includes(advantage)}
                                            onChange={(e) => handleArrayChange('advantages', advantage, e.target.checked)}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Pregunta 10: Preocupaciones */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    10. ¿Qué preocupaciones tienes sobre el uso de chatbots? (Selecciona todas las que apliquen)
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {TEACHER_CONCERNS.map((concern) => (
                                        <Checkbox
                                            key={concern}
                                            label={concern}
                                            name="concerns"
                                            checked={values.concerns?.includes(concern)}
                                            onChange={(e) => handleArrayChange('concerns', concern, e.target.checked)}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Pregunta 11: Recursos necesarios */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    11. ¿Qué recursos necesitarías para un mejor uso de chatbots? (Selecciona todos los que apliquen)
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {RESOURCES_NEEDED.map((resource) => (
                                        <Checkbox
                                            key={resource}
                                            label={resource}
                                            name="resources_needed"
                                            checked={values.resources_needed?.includes(resource)}
                                            onChange={(e) => handleArrayChange('resources_needed', resource, e.target.checked)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Información demográfica */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold mb-4 text-gray-900">Información Demográfica</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Select
                                label="Rango de edad"
                                name="age_range"
                                value={values.age_range}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                options={AGE_RANGES}
                            />

                            <Select
                                label="Tipo de institución"
                                name="institution_type"
                                value={values.institution_type}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                options={INSTITUTION_TYPES}
                            />

                            <Input
                                label="País *"
                                name="country"
                                value={values.country}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={errors.country}
                                touched={touched.country}
                                placeholder="Ecuador"
                                required
                            />

                            <Select
                                label="Años de experiencia docente"
                                name="years_experience"
                                value={values.years_experience}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                options={YEARS_EXPERIENCE}
                            />
                        </div>
                    </div>

                    {/* Comentarios adicionales */}
                    <Textarea
                        label="Comentarios adicionales (opcional)"
                        name="additional_comments"
                        value={values.additional_comments}
                        onChange={handleChange}
                        placeholder="Comparte cualquier otro pensamiento, sugerencia o experiencia relevante..."
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

export default TeacherSurveyForm;