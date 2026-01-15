import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useForm } from '../hooks/useForm';
import authService from '../services/authService';
import Header from '../components/layout/Header';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import { User, Mail, Lock, Shield } from 'lucide-react';
import { formatRole } from '../utils/formatters';

const Profile = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
    } = useForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const onSubmit = async (formData) => {
        if (formData.newPassword !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        try {
            setLoading(true);
            setError('');
            await authService.updatePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            });
            setSuccess('Contraseña actualizada exitosamente');
        } catch (err) {
            setError(err.message || 'Error al actualizar contraseña');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Header 
                title="Mi Perfil"
                subtitle="Gestiona tu información personal y configuración"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Información del Usuario */}
                <div className="lg:col-span-1">
                    <Card title="Información Personal">
                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
                                {user?.username?.charAt(0).toUpperCase()}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">{user?.username}</h3>
                            <p className="text-gray-600">{user?.email}</p>
                            <span className="mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                {formatRole(user?.role)}
                            </span>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex items-center text-gray-600">
                                <User size={16} className="mr-2" />
                                <span>Usuario: {user?.username}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Mail size={16} className="mr-2" />
                                <span>{user?.email}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Shield size={16} className="mr-2" />
                                <span>Rol: {formatRole(user?.role)}</span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Cambiar Contraseña */}
                <div className="lg:col-span-2">
                    <Card title="Cambiar Contraseña">
                        {error && (
                            <Alert type="error" message={error} onClose={() => setError('')} className="mb-6" />
                        )}
                        {success && (
                            <Alert type="success" message={success} onClose={() => setSuccess('')} className="mb-6" />
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <Input
                                label="Contraseña Actual"
                                name="currentPassword"
                                type="password"
                                value={values.currentPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={errors.currentPassword}
                                touched={touched.currentPassword}
                                icon={<Lock size={20} className="text-gray-400" />}
                                required
                            />

                            <Input
                                label="Nueva Contraseña"
                                name="newPassword"
                                type="password"
                                value={values.newPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={errors.newPassword}
                                touched={touched.newPassword}
                                icon={<Lock size={20} className="text-gray-400" />}
                                required
                            />

                            <Input
                                label="Confirmar Nueva Contraseña"
                                name="confirmPassword"
                                type="password"
                                value={values.confirmPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={errors.confirmPassword}
                                touched={touched.confirmPassword}
                                icon={<Lock size={20} className="text-gray-400" />}
                                required
                            />

                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    loading={loading}
                                >
                                    Actualizar Contraseña
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Profile;