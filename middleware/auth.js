const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        // Obtener el token del header Authorization
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Token de acceso requerido' });
        }
        
        const token = authHeader.substring(7); // Remover 'Bearer ' del inicio
        
        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_secreto_jwt_aqui');
        
        // Agregar la información del usuario al request
        req.user = decoded;
        
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expirado' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Token inválido' });
        }
        return res.status(500).json({ message: 'Error en la autenticación' });
    }
};

module.exports = authMiddleware; 