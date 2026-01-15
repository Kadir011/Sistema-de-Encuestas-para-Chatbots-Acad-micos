import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/layout/Header';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Alert from '../components/common/Alert';
import { Bell, Lock, Eye, EyeOff, Save } from 'lucide-react';

const Settings = () => {
	const { user } = useAuth();
	const [activeTab, setActiveTab] = useState('general');
	const [message, setMessage] = useState('');
	const [messageType, setMessageType] = useState('');

	// Configuración General
	const [generalSettings, setGeneralSettings] = useState({
		emailNotifications: true,
		pushNotifications: true,
		surveyReminders: true,
		marketingEmails: false,
	});

	// Cambio de contraseña
	const [passwordSettings, setPasswordSettings] = useState({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	});

	const [showPasswords, setShowPasswords] = useState({
		current: false,
		new: false,
		confirm: false,
	});

	const handleGeneralChange = (key) => {
		setGeneralSettings(prev => ({
			...prev,
			[key]: !prev[key]
		}));
		showMessage('success', 'Configuración actualizada');
	};

	const handlePasswordChange = (e) => {
		setPasswordSettings(prev => ({
			...prev,
			[e.target.name]: e.target.value
		}));
	};

	const handlePasswordSubmit = (e) => {
		e.preventDefault();
		
		if (!passwordSettings.currentPassword) {
			showMessage('error', 'Por favor ingresa tu contraseña actual');
			return;
		}

		if (!passwordSettings.newPassword) {
			showMessage('error', 'Por favor ingresa una nueva contraseña');
			return;
		}

		if (passwordSettings.newPassword.length < 6) {
			showMessage('error', 'La contraseña debe tener al menos 6 caracteres');
			return;
		}

		if (passwordSettings.newPassword !== passwordSettings.confirmPassword) {
			showMessage('error', 'Las contraseñas no coinciden');
			return;
		}

		// Aquí iría la llamada a la API para cambiar la contraseña
		showMessage('success', 'Contraseña cambiad exitosamente');
		setPasswordSettings({
			currentPassword: '',
			newPassword: '',
			confirmPassword: '',
		});
	};

	const showMessage = (type, text) => {
		setMessageType(type);
		setMessage(text);
		setTimeout(() => setMessage(''), 3000);
	};

	return (
		<div>
			<Header
				title="Configuración"
				subtitle="Gestiona tus preferencias y configuración de cuenta"
			/>

			{message && (
				<Alert
					type={messageType}
					message={message}
					onClose={() => setMessage('')}
					className="mb-6"
				/>
			)}

			<div className="bg-white rounded-lg shadow">
				{/* Tabs */}
				<div className="flex border-b">
					<button
						onClick={() => setActiveTab('general')}
						className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
							activeTab === 'general'
								? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
								: 'text-gray-600 hover:text-gray-800'
						}`}
					>
						<Bell className="inline mr-2" size={18} />
						General
					</button>
					<button
						onClick={() => setActiveTab('security')}
						className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
							activeTab === 'security'
								? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
								: 'text-gray-600 hover:text-gray-800'
						}`}
					>
						<Lock className="inline mr-2" size={18} />
						Seguridad
					</button>
				</div>

				{/* Content */}
				<div className="p-6">
					{/* Tab: Configuración General */}
					{activeTab === 'general' && (
						<div className="space-y-6 max-w-2xl">
							<div>
								<h3 className="text-lg font-semibold mb-4">Notificaciones</h3>
								<div className="space-y-4">
									<label className="flex items-center cursor-pointer">
										<input
											type="checkbox"
											checked={generalSettings.emailNotifications}
											onChange={() => handleGeneralChange('emailNotifications')}
											className="w-4 h-4 text-blue-600 rounded"
										/>
										<span className="ml-3">
											<span className="block font-medium text-gray-900">
												Notificaciones por Email
											</span>
											<span className="block text-sm text-gray-500">
												Recibe notificaciones importantes vía correo electrónico
											</span>
										</span>
									</label>

									<label className="flex items-center cursor-pointer">
										<input
											type="checkbox"
											checked={generalSettings.pushNotifications}
											onChange={() => handleGeneralChange('pushNotifications')}
											className="w-4 h-4 text-blue-600 rounded"
										/>
										<span className="ml-3">
											<span className="block font-medium text-gray-900">
												Notificaciones Push
											</span>
											<span className="block text-sm text-gray-500">
												Recibe notificaciones en tiempo real del navegador
											</span>
										</span>
									</label>

									<label className="flex items-center cursor-pointer">
										<input
											type="checkbox"
											checked={generalSettings.surveyReminders}
											onChange={() => handleGeneralChange('surveyReminders')}
											className="w-4 h-4 text-blue-600 rounded"
										/>
										<span className="ml-3">
											<span className="block font-medium text-gray-900">
												Recordatorios de Encuestas
											</span>
											<span className="block text-sm text-gray-500">
												Recibe recordatorios para completar encuestas pendientes
											</span>
										</span>
									</label>

									<label className="flex items-center cursor-pointer">
										<input
											type="checkbox"
											checked={generalSettings.marketingEmails}
											onChange={() => handleGeneralChange('marketingEmails')}
											className="w-4 h-4 text-blue-600 rounded"
										/>
										<span className="ml-3">
											<span className="block font-medium text-gray-900">
												Emails de Marketing
											</span>
											<span className="block text-sm text-gray-500">
												Recibe información sobre nuevas funcionalidades y ofertas
											</span>
										</span>
									</label>
								</div>
							</div>

							<div className="border-t pt-6">
								<h3 className="text-lg font-semibold mb-4">Información de Cuenta</h3>
								<div className="bg-gray-50 p-4 rounded-lg space-y-3">
									<div>
										<label className="block text-sm font-medium text-gray-700">
											Nombre de usuario
										</label>
										<p className="mt-1 text-gray-900">{user?.username}</p>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700">
											Email
										</label>
										<p className="mt-1 text-gray-900">{user?.email}</p>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700">
											Rol
										</label>
										<p className="mt-1 text-gray-900 capitalize">{user?.role}</p>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Tab: Seguridad */}
					{activeTab === 'security' && (
						<div className="max-w-2xl">
							<div>
								<h3 className="text-lg font-semibold mb-6">Cambiar Contraseña</h3>
								<form onSubmit={handlePasswordSubmit} className="space-y-4">
									<div className="relative">
										<Input
											label="Contraseña Actual"
											type={showPasswords.current ? 'text' : 'password'}
											name="currentPassword"
											value={passwordSettings.currentPassword}
											onChange={handlePasswordChange}
											placeholder="Ingresa tu contraseña actual"
										/>
										<button
											type="button"
											onClick={() =>
												setShowPasswords(prev => ({
													...prev,
													current: !prev.current
												}))
											}
											className="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
										>
											{showPasswords.current ? (
												<EyeOff size={18} />
											) : (
												<Eye size={18} />
											)}
										</button>
									</div>

									<div className="relative">
										<Input
											label="Nueva Contraseña"
											type={showPasswords.new ? 'text' : 'password'}
											name="newPassword"
											value={passwordSettings.newPassword}
											onChange={handlePasswordChange}
											placeholder="Ingresa tu nueva contraseña"
										/>
										<button
											type="button"
											onClick={() =>
												setShowPasswords(prev => ({
													...prev,
													new: !prev.new
												}))
											}
											className="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
										>
											{showPasswords.new ? (
												<EyeOff size={18} />
											) : (
												<Eye size={18} />
											)}
										</button>
									</div>

									<div className="relative">
										<Input
											label="Confirmar Nueva Contraseña"
											type={showPasswords.confirm ? 'text' : 'password'}
											name="confirmPassword"
											value={passwordSettings.confirmPassword}
											onChange={handlePasswordChange}
											placeholder="Confirma tu nueva contraseña"
										/>
										<button
											type="button"
											onClick={() =>
												setShowPasswords(prev => ({
													...prev,
													confirm: !prev.confirm
												}))
											}
											className="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
										>
											{showPasswords.confirm ? (
												<EyeOff size={18} />
											) : (
												<Eye size={18} />
											)}
										</button>
									</div>

									<div className="flex justify-end pt-4">
										<Button type="submit">
											<Save className="inline mr-2" size={18} />
											Cambiar Contraseña
										</Button>
									</div>
								</form>
							</div>

							<div className="mt-8 pt-8 border-t">
								<h3 className="text-lg font-semibold mb-4">Sesiones Activas</h3>
								<div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
									<p className="text-sm text-blue-800">
										Actualmente tienes una sesión activa. Tu sesión permanecerá activa hasta que cierres sesión o tu token expire.
									</p>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Settings;
