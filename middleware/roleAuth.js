const roleAuth = (allowedRoles) => {
    return (req, res, next) => {
        try {
            // Verificar que el usuario esté autenticado
            if (!req.user) {
                return res.status(401).json({ message: 'Usuario no autenticado' });
            }

            // Verificar que el rol del usuario esté permitido
            if (!allowedRoles.includes(req.user.rol)) {
                return res.status(403).json({ 
                    message: 'No tienes permisos para acceder a este recurso',
                    requiredRoles: allowedRoles,
                    userRole: req.user.rol
                });
            }

            next();
        } catch (error) {
            res.status(500).json({ message: 'Error en la autorización' });
        }
    };
};

// Roles específicos para cada módulo
const ROLES = {
    ALL: ['Direccion', 'Prefecto', 'Maestro', 'Trabajo Social', 'Enfermeria'],
    ADMIN_ONLY: ['Direccion', 'Trabajo Social'],
    PREFE_AND_ADMIN: ['Direccion', 'Prefecto', 'Trabajo Social'],
    ENTRADAS_SALIDAS: ['Direccion', 'Prefecto', 'Maestro', 'Trabajo Social'],
    MAESTRO_AND_UP: ['Direccion', 'Prefecto', 'Maestro', 'Trabajo Social', 'Enfermeria']
};

module.exports = { roleAuth, ROLES }; 