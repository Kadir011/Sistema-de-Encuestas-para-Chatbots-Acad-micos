// Formatear fecha
export const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    
    return date.toLocaleDateString('es-ES', options);
};

// Formatear fecha y hora
export const formatDateTime = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    };
    
    return date.toLocaleDateString('es-ES', options);
};

// Formatear fecha relativa (hace 2 días, etc.)
export const formatRelativeDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Hoy';
    if (diffInDays === 1) return 'Ayer';
    if (diffInDays < 7) return `Hace ${diffInDays} días`;
    if (diffInDays < 30) return `Hace ${Math.floor(diffInDays / 7)} semanas`;
    if (diffInDays < 365) return `Hace ${Math.floor(diffInDays / 30)} meses`;
    return `Hace ${Math.floor(diffInDays / 365)} años`;
};

// Formatear nombre completo
export const formatFullName = (firstName, lastName) => {
    return `${firstName} ${lastName}`.trim();
};

// Formatear role en español
export const formatRole = (role) => {
    const roles = {
        student: 'Estudiante',
        teacher: 'Profesor',
        admin: 'Administrador',
    };
    return roles[role] || role;
};

// Formatear número con separador de miles
export const formatNumber = (num) => {
    if (!num && num !== 0) return '';
    return num.toLocaleString('es-ES');
};

// Formatear porcentaje
export const formatPercentage = (num, decimals = 1) => {
    if (!num && num !== 0) return '0%';
    return `${num.toFixed(decimals)}%`;
};

// Truncar texto
export const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
};

// Capitalizar primera letra
export const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Formatear array a string separado por comas
export const formatArrayToString = (arr) => {
    if (!Array.isArray(arr) || arr.length === 0) return '';
    return arr.join(', ');
};