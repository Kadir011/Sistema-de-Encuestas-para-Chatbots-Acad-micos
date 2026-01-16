import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generar JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

export const register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Seguridad: No permitir registro de admins desde el endpoint público
        if (role === 'admin') {
            return res.status(403).json({
                success: false,
                message: 'No se permite el registro de administradores por esta vía'
            });
        }

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

        // Crear usuario
        const newUser = await User.create({
            username,
            email,
            password,
            role: role || 'student'
        });

        const token = generateToken(newUser.id);

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
                created_at: newUser.created_at
            },
            token
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al registrar usuario',
            error: error.message
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Mapeo de mensajes de error personalizados
        const errorMessages = {
            student: 'Solo acceso a estudiantes',
            teacher: 'Solo acceso a docentes',
            admin: 'Solo acceso a admin'
        };

        const defaultError = errorMessages[role] || 'Credenciales inválidas';

        // Buscar usuario por email
        const user = await User.findByEmail(email);
        
        // Validar existencia y coincidencia estricta de ROL
        if (!user || user.role !== role) {
            return res.status(401).json({
                success: false,
                message: defaultError
            });
        }

        // Verificar contraseña
        const isPasswordValid = await User.verifyPassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: defaultError
            });
        }

        const token = generateToken(user.id);

        res.json({
            success: true,
            message: 'Inicio de sesión exitoso',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                created_at: user.created_at
            },
            token
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al iniciar sesión',
            error: error.message
        });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
        res.json({ success: true, user: { id: user.id, username: user.username, email: user.email, role: user.role, created_at: user.created_at } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener perfil', error: error.message });
    }
};

export const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'Se requiere la contraseña actual y la nueva contraseña' });
        }
        const user = await User.findByEmail(req.user.email);
        const isPasswordValid = await User.verifyPassword(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'La contraseña actual es incorrecta' });
        }
        await User.updatePassword(req.user.id, newPassword);
        res.json({ success: true, message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar contraseña', error: error.message });
    }
};

export const logout = async (req, res) => {
    res.json({ success: true, message: 'Sesión cerrada exitosamente' });
};

export default { register, login, getProfile, updatePassword, logout };