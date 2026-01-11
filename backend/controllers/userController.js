import User from '../models/User.js';

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();

        res.json({
            success: true,
            message: 'Usuarios obtenidos exitosamente',
            count: users.length,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener usuarios',
            error: error.message
        });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Usuario obtenido exitosamente',
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener usuario',
            error: error.message
        });
    }
};

export const createUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Verificar si el email ya existe
        const existingEmail = await User.findByEmail(email);
        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: 'El correo electrónico ya está registrado'
            });
        }

        // Verificar si el username ya existe
        const existingUsername = await User.findByUsername(username);
        if (existingUsername) {
            return res.status(400).json({
                success: false,
                message: 'El nombre de usuario ya está en uso'
            });
        }

        const newUser = await User.create({
            username,
            email,
            password,
            role: role || 'student'
        });

        res.status(201).json({
            success: true,
            message: 'Usuario creado exitosamente',
            user: newUser
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear usuario',
            error: error.message
        });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, role } = req.body;

        // Verificar que el usuario existe
        const existingUser = await User.findById(id);
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // Solo admin puede cambiar roles
        if (role && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Solo administradores pueden cambiar roles'
            });
        }

        // Si se actualiza el email, verificar que no esté en uso
        if (email && email !== existingUser.email) {
            const emailInUse = await User.findByEmail(email);
            if (emailInUse) {
                return res.status(400).json({
                    success: false,
                    message: 'El correo electrónico ya está en uso'
                });
            }
        }

        // Si se actualiza el username, verificar que no esté en uso
        if (username && username !== existingUser.username) {
            const usernameInUse = await User.findByUsername(username);
            if (usernameInUse) {
                return res.status(400).json({
                    success: false,
                    message: 'El nombre de usuario ya está en uso'
                });
            }
        }

        const updatedUser = await User.update(id, { username, email, role });

        res.json({
            success: true,
            message: 'Usuario actualizado exitosamente',
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar usuario',
            error: error.message
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar que el usuario existe
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // No permitir que el usuario se elimine a sí mismo
        if (parseInt(id) === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'No puedes eliminar tu propia cuenta'
            });
        }

        await User.delete(id);

        res.json({
            success: true,
            message: 'Usuario eliminado exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar usuario',
            error: error.message
        });
    }
};

export const getUserStatistics = async (req, res) => {
    try {
        const statistics = await User.getStatistics();

        res.json({
            success: true,
            message: 'Estadísticas obtenidas exitosamente',
            statistics
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener estadísticas',
            error: error.message
        });
    }
};

export default {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getUserStatistics
};