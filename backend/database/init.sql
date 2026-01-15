-- Eliminar tablas si existen
DROP TABLE IF EXISTS teacher_surveys CASCADE;
DROP TABLE IF EXISTS student_surveys CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Crear tabla de usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de encuestas de estudiantes
CREATE TABLE student_surveys (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    has_used_chatbot BOOLEAN NOT NULL,
    chatbots_used TEXT[],
    usage_frequency VARCHAR(50),
    usefulness_rating INTEGER CHECK (usefulness_rating >= 1 AND usefulness_rating <= 5),
    tasks_used_for TEXT[],
    overall_experience INTEGER CHECK (overall_experience >= 1 AND overall_experience <= 5),
    preferred_chatbot VARCHAR(100),
    effectiveness_comparison VARCHAR(100),
    will_continue_using BOOLEAN,
    would_recommend BOOLEAN,
    additional_comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de encuestas de profesores
CREATE TABLE teacher_surveys (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    has_used_chatbot BOOLEAN NOT NULL,
    chatbots_used TEXT[],
    courses_used TEXT[],
    purposes TEXT[],
    outcomes TEXT[],
    challenges TEXT[],
    likelihood_future_use VARCHAR(50),
    advantages TEXT[],
    concerns TEXT[],
    resources_needed TEXT[],
    would_recommend BOOLEAN,
    age_range VARCHAR(50),
    institution_type VARCHAR(100),
    country VARCHAR(100),
    years_experience VARCHAR(50),
    additional_comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_student_surveys_user_id ON student_surveys(user_id);
CREATE INDEX idx_teacher_surveys_user_id ON teacher_surveys(user_id);
CREATE INDEX idx_student_surveys_created_at ON student_surveys(created_at DESC);
CREATE INDEX idx_teacher_surveys_created_at ON teacher_surveys(created_at DESC);

-- Insertar administrador de prueba (Password: admin123)
INSERT INTO users (username, email, password, role)
VALUES ('admin', 'admin@gmail.com', '$2b$10$GnYOFnsR5p.H572rHbQ7C.NufDJ.Zct/F03B/MDxCvrwik4EQBHuW', 'admin');