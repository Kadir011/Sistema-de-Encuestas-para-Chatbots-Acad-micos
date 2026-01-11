import { query } from '../config/database.js';
import bcrypt from 'bcrypt';

class User {
    // Crear nuevo usuario
    static async create({ username, email, password, role = 'student' }) {
        try {
            // Hash de la contraseña con salt rounds de 10
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const text = `
                INSERT INTO users (username, email, password, role)
                VALUES ($1, $2, $3, $4)
                RETURNING id, username, email, role, created_at
            `;
            const values = [username, email, hashedPassword, role];

            const result = await query(text, values);
            return result.rows[0];
        } catch (error) {
            // Manejo de errores de violación de unicidad
            if (error.code === '23505') {
                if (error.constraint === 'users_email_key') {
                    throw new Error('El email ya está registrado');
                }
                if (error.constraint === 'users_username_key') {
                    throw new Error('El nombre de usuario ya está en uso');
                }
            }
            throw new Error(`Error al crear usuario: ${error.message}`);
        }
    }

    // Buscar usuario por email
    static async findByEmail(email) {
        try {
            const text = 'SELECT * FROM users WHERE email = $1';
            const result = await query(text, [email]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error al buscar usuario por email: ${error.message}`);
        }
    }

    // Buscar usuario por ID
    static async findById(id) {
        try {
            const text = `
                SELECT id, username, email, role, created_at 
                FROM users 
                WHERE id = $1
            `;
            const result = await query(text, [id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error al buscar usuario por ID: ${error.message}`);
        }
    }

    // Buscar usuario por username
    static async findByUsername(username) {
        try {
            const text = 'SELECT * FROM users WHERE username = $1';
            const result = await query(text, [username]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error al buscar usuario: ${error.message}`);
        }
    }

    // Verificar contraseña
    static async verifyPassword(plainPassword, hashedPassword) {
        try {
            return await bcrypt.compare(plainPassword, hashedPassword);
        } catch (error) {
            throw new Error(`Error al verificar contraseña: ${error.message}`);
        }
    }

    // Obtener todos los usuarios (solo admin)
    static async findAll() {
        try {
            const text = `
                SELECT id, username, email, role, created_at 
                FROM users 
                ORDER BY created_at DESC
            `;
            const result = await query(text);
            return result.rows;
        } catch (error) {
            throw new Error(`Error al obtener usuarios: ${error.message}`);
        }
    }

    // Obtener usuarios por rol
    static async findByRole(role) {
        try {
            const text = `
                SELECT id, username, email, role, created_at 
                FROM users 
                WHERE role = $1
                ORDER BY created_at DESC
            `;
            const result = await query(text, [role]);
            return result.rows;
        } catch (error) {
            throw new Error(`Error al obtener usuarios por rol: ${error.message}`);
        }
    }

    // Actualizar usuario
    static async update(id, { username, email, role }) {
        try {
            const text = `
                UPDATE users 
                SET 
                    username = COALESCE($1, username),
                    email = COALESCE($2, email),
                    role = COALESCE($3, role)
                WHERE id = $4
                RETURNING id, username, email, role, created_at
            `;
            const values = [username, email, role, id];
            const result = await query(text, values);
            return result.rows[0];
        } catch (error) {
            if (error.code === '23505') {
                if (error.constraint === 'users_email_key') {
                    throw new Error('El email ya está en uso');
                }
                if (error.constraint === 'users_username_key') {
                    throw new Error('El nombre de usuario ya está en uso');
                }
            }
            throw new Error(`Error al actualizar usuario: ${error.message}`);
        }
    }

    // Actualizar contraseña
    static async updatePassword(id, newPassword) {
        try {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

            const text = `
                UPDATE users 
                SET password = $1
                WHERE id = $2
                RETURNING id
            `;
            const result = await query(text, [hashedPassword, id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error al actualizar contraseña: ${error.message}`);
        }
    }

    // Eliminar usuario
    static async delete(id) {
        try {
            const text = 'DELETE FROM users WHERE id = $1 RETURNING id';
            const result = await query(text, [id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error al eliminar usuario: ${error.message}`);
        }
    }

    // Contar usuarios por rol
    static async countByRole() {
        try {
            const text = `
                SELECT 
                    role,
                    COUNT(*) as count
                FROM users
                GROUP BY role
            `;
            const result = await query(text);
            return result.rows;
        } catch (error) {
            throw new Error(`Error al contar usuarios: ${error.message}`);
        }
    }

    // Obtener estadísticas de usuarios
    static async getStatistics() {
        try {
            const text = `
                SELECT 
                    COUNT(*) as total_users,
                    COUNT(CASE WHEN role = 'admin' THEN 1 END) as admins,
                    COUNT(CASE WHEN role = 'teacher' THEN 1 END) as teachers,
                    COUNT(CASE WHEN role = 'student' THEN 1 END) as students,
                    COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as new_this_week,
                    COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as new_this_month
                FROM users
            `;
            const result = await query(text);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error al obtener estadísticas: ${error.message}`);
        }
    }
}

export default User;