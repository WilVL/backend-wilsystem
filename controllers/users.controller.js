const pool = require('../config/db.config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, nombre, rol FROM Usuarios');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener un usuario por ID
exports.getUserById = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, nombre, rol FROM Usuarios WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear un nuevo usuario
exports.createUser = async (req, res) => {
    try {
        const { nombre, contraseña, rol } = req.body;
        const hashedPassword = await bcrypt.hash(contraseña, 10);
        const [result] = await pool.query(
            'INSERT INTO Usuarios (nombre, contraseña, rol) VALUES (?, ?, ?)',
            [nombre, hashedPassword, rol]
        );
        res.status(201).json({ id: result.insertId, nombre, rol });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un usuario
exports.updateUser = async (req, res) => {
    try {
        const { nombre, contraseña, rol } = req.body;
        let query = 'UPDATE Usuarios SET nombre = ?, rol = ?';
        let params = [nombre, rol];
        if (contraseña) {
            const hashedPassword = await bcrypt.hash(contraseña, 10);
            query += ', contraseña = ?';
            params.push(hashedPassword);
        }
        query += ' WHERE id = ?';
        params.push(req.params.id);
        const [result] = await pool.query(query, params);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar un usuario
exports.deleteUser = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM Usuarios WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login de usuario
exports.login = async (req, res) => {
    try {
        const { nombre, contraseña } = req.body;
        
        // Validar que se proporcionen los campos
        if (!nombre || !contraseña) {
            return res.status(400).json({ message: 'Nombre de usuario y contraseña son requeridos' });
        }
        
        // Buscar usuario por nombre
        const [rows] = await pool.query('SELECT id, nombre, contraseña, rol FROM Usuarios WHERE nombre = ?', [nombre]);
        
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }
        
        const user = rows[0];
        
        // Verificar contraseña
        const isValidPassword = await bcrypt.compare(contraseña, user.contraseña);
        
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }
        
        // Generar JWT token
        const token = jwt.sign(
            { 
                id: user.id, 
                nombre: user.nombre, 
                rol: user.rol 
            },
            process.env.JWT_SECRET || 'tu_secreto_jwt_aqui',
            { expiresIn: '24h' }
        );
        
        // Enviar respuesta sin la contraseña
        res.json({
            token,
            user: {
                id: user.id,
                nombre: user.nombre,
                rol: user.rol
            }
        });
        
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Crear usuario inicial (sin autenticación)
exports.createInitialUser = async (req, res) => {
    try {
        const { nombre, contraseña, rol } = req.body;
        
        // Verificar que no existan usuarios
        const [existingUsers] = await pool.query('SELECT COUNT(*) as count FROM Usuarios');
        
        if (existingUsers[0].count > 0) {
            return res.status(400).json({ message: 'Ya existen usuarios en el sistema' });
        }
        
        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(contraseña, 10);
        
        // Insertar usuario
        const [result] = await pool.query(
            'INSERT INTO Usuarios (nombre, contraseña, rol) VALUES (?, ?, ?)',
            [nombre, hashedPassword, rol]
        );
        
        res.status(201).json({ 
            message: 'Usuario inicial creado exitosamente',
            user: { id: result.insertId, nombre, rol }
        });
        
    } catch (error) {
        console.error('Error creando usuario inicial:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}; 