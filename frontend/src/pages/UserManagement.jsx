import { useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Alert from '../components/common/Alert';
import Loading from '../components/common/Loading';
import Badge from '../components/common/Badge';
import userService from '../services/userService';
import { Plus, Trash2, Edit2, Search } from 'lucide-react';

const UserManagement = () => {
	const [users, setUsers] = useState([]);
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [searchTerm, setSearchTerm] = useState('');
	const [roleFilter, setRoleFilter] = useState('all');

	// Modal para crear/editar
	const [showModal, setShowModal] = useState(false);
	const [editingUser, setEditingUser] = useState(null);
	const [formData, setFormData] = useState({
		username: '',
		email: '',
		password: '',
		role: 'student',
	});

	// Modal de confirmación para eliminar
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [userToDelete, setUserToDelete] = useState(null);

	useEffect(() => {
		loadUsers();
	}, []);

	useEffect(() => {
		filterUsers();
	}, [users, searchTerm, roleFilter]);

	const loadUsers = async () => {
		try {
			setLoading(true);
			setError('');
			const response = await userService.getAll();
			console.log('Respuesta de usuarios:', response);
			
			// Manejar diferentes estructuras de respuesta
			const usersData = response?.users || response?.data?.users || [];
			console.log('Usuarios cargados:', usersData);
			
			if (Array.isArray(usersData)) {
				setUsers(usersData);
			} else {
				console.warn('La respuesta de usuarios no es un array:', usersData);
				setUsers([]);
				setError('Formato de respuesta inválido del servidor');
			}
		} catch (err) {
			console.error('Error al cargar usuarios:', err);
			setError('Error al cargar usuarios: ' + (err.message || 'Error desconocido'));
			setUsers([]);
		} finally {
			setLoading(false);
		}
	};

	const filterUsers = () => {
		let filtered = Array.isArray(users) ? users : [];

		// Filtrar por búsqueda
		if (searchTerm && searchTerm.trim()) {
			filtered = filtered.filter(user => {
				const username = user?.username || '';
				const email = user?.email || '';
				const searchLower = searchTerm.toLowerCase();
				return (
					username.toLowerCase().includes(searchLower) ||
					email.toLowerCase().includes(searchLower)
				);
			});
		}

		// Filtrar por rol
		if (roleFilter !== 'all') {
			filtered = filtered.filter(user => user?.role === roleFilter);
		}

		setFilteredUsers(filtered);
	};

	const handleOpenModal = (user = null) => {
		if (user) {
			setEditingUser(user);
			setFormData({
				username: user.username,
				email: user.email,
				password: '',
				role: user.role,
			});
		} else {
			setEditingUser(null);
			setFormData({
				username: '',
				email: '',
				password: '',
				role: 'student',
			});
		}
		setShowModal(true);
	};

	const handleCloseModal = () => {
		setShowModal(false);
		setEditingUser(null);
		setFormData({
			username: '',
			email: '',
			password: '',
			role: 'student',
		});
	};

	const handleFormChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!formData.username || !formData.email) {
			setError('Username y email son requeridos');
			return;
		}

		if (!editingUser && !formData.password) {
			setError('La contraseña es requerida para nuevos usuarios');
			return;
		}

		try {
			setError('');
			if (editingUser) {
				// Editar usuario
				const dataToSend = {
					username: formData.username,
					email: formData.email,
					role: formData.role,
				};
				if (formData.password) {
					dataToSend.password = formData.password;
				}
				await userService.update(editingUser.id, dataToSend);
				setSuccess('Usuario actualizado exitosamente');
			} else {
				// Crear usuario
				await userService.create(formData);
				setSuccess('Usuario creado exitosamente');
			}
			handleCloseModal();
			loadUsers();
			setTimeout(() => setSuccess(''), 3000);
		} catch (err) {
			setError(err.message || 'Error al guardar usuario');
		}
	};

	const handleDeleteClick = (user) => {
		setUserToDelete(user);
		setShowDeleteConfirm(true);
	};

	const handleConfirmDelete = async () => {
		try {
			setError('');
			await userService.delete(userToDelete.id);
			setSuccess('Usuario eliminado exitosamente');
			setShowDeleteConfirm(false);
			setUserToDelete(null);
			loadUsers();
			setTimeout(() => setSuccess(''), 3000);
		} catch (err) {
			setError('Error al eliminar usuario');
		}
	};

	const getRoleBadgeColor = (role) => {
		const colors = {
			admin: 'purple',
			teacher: 'blue',
			student: 'green',
		};
		return colors[role] || 'gray';
	};

	const roleLabelMap = {
		admin: 'Administrador',
		teacher: 'Profesor',
		student: 'Estudiante',
	};

	if (loading) {
		return <Loading fullScreen text="Cargando usuarios..." />;
	}

	return (
		<div>
			<Header
				title="Gestión de Usuarios"
				subtitle="Administra estudiantes, profesores y otros usuarios del sistema"
			/>

			{error && (
				<Alert
					type="error"
					message={error}
					onClose={() => setError('')}
					className="mb-6"
				/>
			)}

			{success && (
				<Alert
					type="success"
					message={success}
					onClose={() => setSuccess('')}
					className="mb-6"
				/>
			)}

			{/* Filtros y búsqueda */}
			<div className="bg-white rounded-lg shadow-md p-6 mb-6">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="relative">
						<Search className="absolute left-3 top-3 text-gray-400" size={20} />
						<input
							type="text"
							placeholder="Buscar por usuario o email..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<select
						value={roleFilter}
						onChange={(e) => setRoleFilter(e.target.value)}
						className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="all">Todos los roles</option>
						<option value="admin">Administrador</option>
						<option value="teacher">Profesor</option>
						<option value="student">Estudiante</option>
					</select>

					<div className="flex justify-end">
						<Button onClick={() => handleOpenModal()}>
							<Plus size={18} className="mr-2 inline" />
							Nuevo Usuario
						</Button>
					</div>
				</div>
			</div>

			{/* Tabla de usuarios */}
			<div className="bg-white rounded-lg shadow-md overflow-hidden">
				{users.length === 0 ? (
					<div className="p-8 text-center text-gray-500">
						<p>No hay usuarios en el sistema</p>
					</div>
				) : filteredUsers.length > 0 ? (
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Usuario
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Email
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Rol
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Fecha Creación
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Acciones
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{filteredUsers.map((user) => (
									<tr key={user?.id || Math.random()} className="hover:bg-gray-50">
										<td className="px-6 py-4 whitespace-nowrap">
											<p className="font-medium text-gray-900">{user?.username || 'N/A'}</p>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
											{user?.email || 'N/A'}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<Badge color={getRoleBadgeColor(user?.role || 'student')}>
												{roleLabelMap[user?.role] || 'Estudiante'}
											</Badge>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
											{user?.created_at
												? new Date(user.created_at).toLocaleDateString('es-ES')
												: 'N/A'}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
											<div className="flex gap-2">
												<button
													onClick={() => handleOpenModal(user)}
													className="text-blue-600 hover:text-blue-800 transition-colors"
													title="Editar"
												>
													<Edit2 size={18} />
												</button>
												<button
													onClick={() => handleDeleteClick(user)}
													className="text-red-600 hover:text-red-800 transition-colors"
													title="Eliminar"
												>
													<Trash2 size={18} />
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<div className="p-8 text-center text-gray-500">
						<p>No hay usuarios que coincidan con los filtros</p>
					</div>
				)}
			</div>

			{/* Información de resultados */}
			<div className="mt-4 text-sm text-gray-600">
				Mostrando {filteredUsers.length} de {users.length} usuarios
			</div>

			{/* Modal para crear/editar usuario */}
			<Modal
				isOpen={showModal}
				onClose={handleCloseModal}
				title={editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
			>
				<form onSubmit={handleSubmit} className="space-y-4">
					<Input
						label="Usuario"
						name="username"
						value={formData.username}
						onChange={handleFormChange}
						placeholder="Ingresa el nombre de usuario"
						required
					/>

					<Input
						label="Email"
						type="email"
						name="email"
						value={formData.email}
						onChange={handleFormChange}
						placeholder="correo@ejemplo.com"
						required
					/>

					{!editingUser && (
						<Input
							label="Contraseña"
							type="password"
							name="password"
							value={formData.password}
							onChange={handleFormChange}
							placeholder="Ingresa una contraseña"
							required
						/>
					)}

					{editingUser && (
						<Input
							label="Contraseña (dejar en blanco para no cambiar)"
							type="password"
							name="password"
							value={formData.password}
							onChange={handleFormChange}
							placeholder="Dejar en blanco para mantener la contraseña actual"
						/>
					)}

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Rol
						</label>
						<select
							name="role"
							value={formData.role}
							onChange={handleFormChange}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="student">Estudiante</option>
							<option value="teacher">Profesor</option>
							<option value="admin">Administrador</option>
						</select>
					</div>

					<div className="flex gap-3 justify-end pt-4 border-t">
						<Button variant="secondary" onClick={handleCloseModal}>
							Cancelar
						</Button>
						<Button type="submit">
							{editingUser ? 'Actualizar Usuario' : 'Crear Usuario'}
						</Button>
					</div>
				</form>
			</Modal>

			{/* Modal de confirmación para eliminar */}
			<Modal
				isOpen={showDeleteConfirm}
				onClose={() => setShowDeleteConfirm(false)}
				title="Confirmar Eliminación"
			>
				<div className="space-y-4">
					<p className="text-gray-600">
						¿Estás seguro de que deseas eliminar a{' '}
						<strong>{userToDelete?.username}</strong>?
					</p>
					<p className="text-sm text-red-600">
						Esta acción no se puede deshacer.
					</p>

					<div className="flex gap-3 justify-end pt-4 border-t">
						<Button
							variant="secondary"
							onClick={() => setShowDeleteConfirm(false)}
						>
							Cancelar
						</Button>
						<Button variant="danger" onClick={handleConfirmDelete}>
							Eliminar Usuario
						</Button>
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default UserManagement;
