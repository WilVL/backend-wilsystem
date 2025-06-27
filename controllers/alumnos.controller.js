const pool = require('../config/db.config');

// Obtener todos los alumnos
exports.getAllAlumnos = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Alumnos');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener un alumno por ID
exports.getAlumnoById = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Alumnos WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Alumno no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear un nuevo alumno
exports.createAlumno = async (req, res) => {
    try {
        const { nombre, grupo } = req.body;
        const [result] = await pool.query(
            'INSERT INTO Alumnos (nombre, grupo) VALUES (?, ?)',
            [nombre, grupo]
        );
        
        res.status(201).json({ id: result.insertId, nombre, grupo });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un alumno
exports.updateAlumno = async (req, res) => {
    try {
        const { nombre, grupo } = req.body;
        const [result] = await pool.query(
            'UPDATE Alumnos SET nombre = ?, grupo = ? WHERE id = ?',
            [nombre, grupo, req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Alumno no encontrado' });
        }
        
        res.json({ message: 'Alumno actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar un alumno
exports.deleteAlumno = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM Alumnos WHERE id = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Alumno no encontrado' });
        }
        
        res.json({ message: 'Alumno eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 