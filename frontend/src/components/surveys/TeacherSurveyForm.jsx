import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, X, Save } from 'lucide-react';
import { useForm } from '../../hooks/useForm';
import { validateTeacherSurvey } from '../../utils/validators';
import surveyService from '../../services/surveyService';
import { getCountriesList } from '../../services/apiCountries';
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

// Importaciones con rutas relativas correctas
import Input from '../common/Input';
import Select from '../common/Select';
import Checkbox from '../common/Checkbox';
import Radio from '../common/Radio';
import Textarea from '../common/Textarea';
import Button from '../common/Button';
import Alert from '../common/Alert';
import Card from '../common/Card';
import Loading from '../common/Loading';

const TeacherSurveyForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [loadingCountries, setLoadingCountries] = useState(true);
    const [countriesOptions, setCountriesOptions] = useState([]);
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
            countries: [], // Array para múltiples países
            years_experience: '',
            additional_comments: '',
        },
        validateTeacherSurvey
    );

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const list = await getCountriesList();
                // Formatear para el componente Select: { value, label }
                const formatted = list.map(name => ({ value: name, label: name }));
                setCountriesOptions(formatted);
            } catch (err) {
                console.error("Error al cargar países:", err);
            } finally {
                setLoadingCountries(false);
            }
        };
        fetchCountries();
    }, []);

    // Lógica para añadir país desde el Select sin escribir
    const handleAddCountry = (e) => {
        const countryName = e.target.value;
        if (!countryName) return;
        
        const currentCountries = values.countries || [];
        if (!currentCountries.includes(countryName)) {
            setValue('countries', [...currentCountries, countryName]);
        }
    };

    const removeCountry = (countryName) => {
        setValue('countries', values.countries.filter(c => c !== countryName));
    };

    const onSubmit = async (formData) => {
        try {
            setLoading(true);
            setError('');
            
            // Convertir el input de texto de cursos a un arreglo real
            const dataToSend = {
                ...formData,
                courses_used: coursesInputValue
                    .split(',')
                    .map(c => c.trim())
                    .filter(c => c.length > 0)
            };
            
            // Validaciones manuales adicionales antes de enviar
            if (dataToSend.has_used_chatbot && dataToSend.courses_used.length === 0) {
                setError('Por favor, ingresa al menos un curso o asignatura');
                return;
            }

            if (dataToSend.countries.length === 0) {
                setError('Por favor, selecciona al menos un país');
                return;
            }

            await surveyService.teacher.create(dataToSend);
            setSuccess('¡Encuesta enviada exitosamente!');
            setTimeout(() => navigate('/my-surveys'), 2000);
        } catch (err) {
            setError(err.message || 'Error al enviar la encuesta');
        } finally {
            setLoading(false);
        }
    };

    if (loadingCountries) return <Loading fullScreen />;

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <Card title="Encuesta para Profesores" subtitle="Comparte tu experiencia usando chatbots de IA en la enseñanza">
                {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-6" />}
                {success && <Alert type="success" message={success} className="mb-6" />}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Pregunta 1: Uso de chatbots */}
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

                    {/* Sección condicional: Aparece si responde "Sí" */}
                    {values.has_used_chatbot === true && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            {/* Pregunta 2: Chatbots usados */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    2. ¿Qué chatbots has usado? (Selecciona todos los que apliquen) *
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {CHATBOTS.map((chatbot) => (
                                        <Checkbox
                                            key={chatbot}
                                            label={chatbot}
                                            checked={values.chatbots_used?.includes(chatbot)}
                                            onChange={(e) => handleArrayChange('chatbots_used', chatbot, e.target.checked)}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Pregunta 3: Cursos */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    3. ¿En qué cursos o asignaturas los has usado? (separados por coma) *
                                </label>
                                <input
                                    type="text"
                                    value={coursesInputValue}
                                    onChange={(e) => {
                                        setCoursesInputValue(e.target.value);
                                        const arr = e.target.value.split(',').map(c => c.trim()).filter(c => c.length > 0);
                                        setValue('courses_used', arr);
                                    }}
                                    placeholder="Ej: Matemáticas, Ciencias..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                                {touched.courses_used && errors.courses_used && <p className="mt-1 text-sm text-red-600">{errors.courses_used}</p>}
                            </div>

                            {/* Pregunta 4: Propósitos */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    4. ¿Para qué propósitos los has usado? *
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {TEACHER_PURPOSES.map((p) => (
                                        <Checkbox
                                            key={p}
                                            label={p}
                                            checked={values.purposes?.includes(p)}
                                            onChange={(e) => handleArrayChange('purposes', p, e.target.checked)}
                                        />
                                    ))}
                                </div>
                                {touched.purposes && errors.purposes && <p className="mt-1 text-sm text-red-600">{errors.purposes}</p>}
                            </div>

                            {/* Pregunta 5: Resultados */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    5. ¿Qué resultados has obtenido?
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {TEACHER_OUTCOMES.map((o) => (
                                        <Checkbox
                                            key={o}
                                            label={o}
                                            checked={values.outcomes?.includes(o)}
                                            onChange={(e) => handleArrayChange('outcomes', o, e.target.checked)}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Pregunta 6: Desafíos */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    6. ¿Qué desafíos has enfrentado?
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {TEACHER_CHALLENGES.map((c) => (
                                        <Checkbox
                                            key={c}
                                            label={c}
                                            checked={values.challenges?.includes(c)}
                                            onChange={(e) => handleArrayChange('challenges', c, e.target.checked)}
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
                                options={FUTURE_USE_LIKELIHOOD}
                            />

                            {/* Pregunta 8: Recomendaría */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    8. ¿Recomendarías el uso de chatbots de IA a otros docentes?
                                </label>
                                <div className="flex gap-4">
                                    <Radio
                                        label="Sí"
                                        checked={values.would_recommend === true}
                                        onChange={() => setValue('would_recommend', true)}
                                    />
                                    <Radio
                                        label="No"
                                        checked={values.would_recommend === false}
                                        onChange={() => setValue('would_recommend', false)}
                                    />
                                </div>
                            </div>

                            {/* Pregunta 9: Ventajas */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    9. ¿Qué ventajas ves en el uso docente?
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {TEACHER_ADVANTAGES.map((a) => (
                                        <Checkbox
                                            key={a}
                                            label={a}
                                            checked={values.advantages?.includes(a)}
                                            onChange={(e) => handleArrayChange('advantages', a, e.target.checked)}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Pregunta 10: Preocupaciones */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    10. ¿Qué preocupaciones tienes?
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {TEACHER_CONCERNS.map((c) => (
                                        <Checkbox
                                            key={c}
                                            label={c}
                                            checked={values.concerns?.includes(c)}
                                            onChange={(e) => handleArrayChange('concerns', c, e.target.checked)}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Pregunta 11: Recursos */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    11. ¿Qué recursos necesitarías?
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {RESOURCES_NEEDED.map((r) => (
                                        <Checkbox
                                            key={r}
                                            label={r}
                                            checked={values.resources_needed?.includes(r)}
                                            onChange={(e) => handleArrayChange('resources_needed', r, e.target.checked)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Información Demográfica */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold mb-6 text-gray-900">Información Demográfica</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Selector de Países con etiquetas extraíbles */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Globe size={18} className="text-blue-500" />
                                    Países donde ejerce la docencia (Selecciona uno o más) *
                                </label>
                                
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {values.countries.map(country => (
                                        <span key={country} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                            {country}
                                            <button type="button" onClick={() => removeCountry(country)} className="hover:text-red-500">
                                                <X size={14} />
                                            </button>
                                        </span>
                                    ))}
                                </div>

                                <Select
                                    name="country_select"
                                    value=""
                                    onChange={handleAddCountry}
                                    options={countriesOptions}
                                    placeholder="Selecciona un país para añadirlo..."
                                />
                                {touched.countries && errors.countries && <p className="mt-1 text-sm text-red-600">{errors.countries}</p>}
                            </div>

                            <Select label="Rango de edad" name="age_range" value={values.age_range} onChange={handleChange} options={AGE_RANGES} />
                            <Select label="Tipo de institución" name="institution_type" value={values.institution_type} onChange={handleChange} options={INSTITUTION_TYPES} />
                            <Select label="Años de experiencia" name="years_experience" value={values.years_experience} onChange={handleChange} options={YEARS_EXPERIENCE} />
                        </div>
                    </div>

                    {/* Comentarios adicionales */}
                    <Textarea label="Comentarios adicionales" name="additional_comments" value={values.additional_comments} onChange={handleChange} placeholder="Opcional..." rows={4} />

                    <div className="flex justify-end space-x-4">
                        <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>Cancelar</Button>
                        <Button 
                            type="submit" 
                            variant="primary" 
                            loading={loading} // Se corrigió para usar la prop 'loading' que espera Button.jsx
                            className="flex items-center gap-2"
                        >
                            <Save size={20} /> Enviar Encuesta
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default TeacherSurveyForm;