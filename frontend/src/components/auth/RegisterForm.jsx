import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, UserCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useForm } from '../../hooks/useForm';
import { validateRegisterForm } from '../../utils/validators';
import { ROLES } from '../../utils/constants';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import Alert from '../common/Alert';

const RegisterForm = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');

    const {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
    } = useForm(
        {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: 'student',
        },
        validateRegisterForm
    );

    const onSubmit = async (formValues) => {
        try {
            setError('');
            const { confirmPassword, ...registerData } = formValues;
            await register(registerData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Error al registrarse');
        }
    };

    const roleOptions = [
        { value: ROLES.STUDENT, label: 'Estudiante' },
        { value: ROLES.TEACHER, label: 'Profesor' },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <UserCircle size={32} className="text-blue-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Crear Cuenta
                        </h2>
                        <p className="text-gray-600">
                            Únete y empieza a participar en nuestras encuestas
                        </p>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <Alert
                            type="error"
                            message={error}
                            onClose={() => setError('')}
                            className="mb-6"
                        />
                    )}

                    {/* Formulario */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <Input
                            label="Nombre de Usuario"
                            name="username"
                            type="text"
                            value={values.username}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.username}
                            touched={touched.username}
                            placeholder="usuario123"
                            icon={<User size={20} className="text-gray-400" />}
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

                        <Select
                            label="Tipo de Cuenta"
                            name="role"
                            value={values.role}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.role}
                            touched={touched.role}
                            options={roleOptions}
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

                        <div className="relative">
                            <Input
                                label="Confirmar Contraseña"
                                name="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={values.confirmPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={errors.confirmPassword}
                                touched={touched.confirmPassword}
                                placeholder="••••••••"
                                icon={<Lock size={20} className="text-gray-400" />}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            size="lg"
                        >
                            Crear Cuenta
                        </Button>
                    </form>

                    {/* Login */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            ¿Ya tienes una cuenta?{' '}
                            <Link
                                to="/login"
                                className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Inicia sesión
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-gray-600 mt-6 text-sm">
                    Al registrarte, aceptas nuestros{' '}
                    <Link to="/terms" className="text-blue-600 hover:underline">
                        Términos de Servicio
                    </Link>{' '}
                    y{' '}
                    <Link to="/privacy" className="text-blue-600 hover:underline">
                        Política de Privacidad
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterForm;