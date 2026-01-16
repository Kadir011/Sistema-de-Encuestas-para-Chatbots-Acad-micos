import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useForm } from '../../hooks/useForm';
import { validateLoginForm } from '../../utils/validators';
import { ROLES } from '../../utils/constants';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import Alert from '../common/Alert';

const LoginForm = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
    } = useForm(
        { email: '', password: '', role: ROLES.STUDENT }, // Estudiante por defecto
        validateLoginForm
    );

    const onSubmit = async (formValues) => {
        try {
            setError('');
            await login(formValues);
            navigate('/dashboard');
        } catch (err) {
            // El mensaje detallado ("Solo acceso a...") proviene del backend modificado
            setError(err.message || 'Error al iniciar sesión');
        }
    };

    const roleOptions = [
        { value: ROLES.STUDENT, label: 'Estudiante' },
        { value: ROLES.TEACHER, label: 'Docente' },
        { value: ROLES.ADMIN, label: 'Administrador' },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Iniciar Sesión
                        </h2>
                        <p className="text-gray-600">
                            Selecciona tu tipo de cuenta e ingresa
                        </p>
                    </div>

                    {error && (
                        <Alert
                            type="error"
                            message={error}
                            onClose={() => setError('')}
                            className="mb-6"
                        />
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Selector de Rol */}
                        <Select
                            label="Tipo de Acceso"
                            name="role"
                            value={values.role}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.role}
                            touched={touched.role}
                            options={roleOptions}
                            icon={<ShieldCheck size={20} className="text-gray-400" />}
                            required
                        />

                        <Input
                            label="Correo Electrónico"
                            name="email"
                            type="email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.email}
                            touched={touched.email}
                            placeholder="tu@email.com"
                            icon={<Mail size={20} className="text-gray-400" />}
                            required
                        />

                        <div className="relative">
                            <Input
                                label="Contraseña"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={errors.password}
                                touched={touched.password}
                                placeholder="••••••••"
                                icon={<Lock size={20} className="text-gray-400" />}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            size="lg"
                        >
                            Acceder como {roleOptions.find(r => r.value === values.role)?.label}
                        </Button>
                    </form>

                    {/* Registro dinámico para Estudiante o Docente */}
                    {values.role !== ROLES.ADMIN && (
                        <div className="mt-6 text-center">
                            <p className="text-gray-600">
                                ¿No tienes una cuenta de {roleOptions.find(r => r.value === values.role)?.label}?{' '}
                                <Link
                                    to={`/register/${values.role}`}
                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Regístrate aquí
                                </Link>
                            </p>
                        </div>
                    )}
                </div>

                <p className="text-center text-gray-600 mt-6 text-sm">
                    Al iniciar sesión, aceptas nuestros{' '}
                    <Link to="/terms" className="text-blue-600 hover:underline">Términos</Link> y <Link to="/privacy" className="text-blue-600 hover:underline">Privacidad</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginForm;