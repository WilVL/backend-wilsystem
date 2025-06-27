const pool = require('../config/db.config');
const bcrypt = require('bcryptjs');

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