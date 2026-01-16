import { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, UserCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useForm } from '../../hooks/useForm';
import { validateRegisterForm } from '../../utils/validators';
import { ROLES } from '../../utils/constants';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';

const RegisterForm = () => {
    const { role } = useParams(); // Obtiene el rol de la URL (ej: /register/student)
    const navigate = useNavigate();
    const { register } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');

    // Traducir el rol para la interfaz de usuario
    const roleLabel = role === ROLES.TEACHER ? 'Docente' : 'Estudiante';

    const {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        setValue,
    } = useForm(
        {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: role || ROLES.STUDENT, // Sincroniza con el rol de la URL
        },
        validateRegisterForm
    );

    // Efecto para asegurar que el valor del rol se actualice si cambia el parámetro de la URL
    useEffect(() => {
        if (role) {
            setValue('role', role);
        }
    }, [role, setValue]);

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

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <UserCircle size={32} className="text-blue-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Registro de {roleLabel}
                        </h2>
                        <p className="text-gray-600">
                            Crea tu cuenta para participar en las encuestas
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
                            Registrarse como {roleLabel}
                        </Button>
                    </form>

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
            </div>
        </div>
    );
};

export default RegisterForm;