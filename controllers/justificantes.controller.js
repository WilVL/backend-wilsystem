const pool = require('../config/db.config');

// Obtener todos los justificantes
exports.getAllJustificantes = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT j.*, a.nombre as nombre_alumno 
            FROM Justificantes j 
            JOIN Alumnos a ON j.alumno_id = a.id
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener un justificante por ID
exports.getJustificanteById = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT j.*, a.nombre as nombre_alumno 
            FROM Justificantes j 
            JOIN Alumnos a ON j.alumno_id = a.id 
            WHERE j.id = ?
        `, [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Justificante no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear un nuevo justificante
exports.createJustificante = async (req, res) => {
    try {
        const {
            tipo_justificante,
            departamento,
            alumno_id,
            tutor,
            motivo,
            fecha_inicio,
            tiempo_dias
        } = req.body;

        const [result] = await pool.query(
            `INSERT INTO Justificantes (
                tipo_justificante, departamento, alumno_id, tutor, 
                motivo, fecha_inicio, tiempo_dias
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [tipo_justificante, departamento, alumno_id, tutor, 
             motivo, fecha_inicio, tiempo_dias]
        );
        
        res.status(201).json({
            id: result.insertId,
            ...req.body
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un justificante
exports.updateJustificante = async (req, res) => {
    try {
        const {
            tipo_justificante,
            departamento,
            alumno_id,
            tutor,
            motivo,
            fecha_inicio,
            tiempo_dias
        } = req.body;

        const [result] = await pool.query(
            `UPDATE Justificantes SET 
                tipo_justificante = ?,
                departamento = ?,
                alumno_id = ?,
                tutor = ?,
                motivo = ?,
                fecha_inicio = ?,
                tiempo_dias = ?
            WHERE id = ?`,
            [tipo_justificante, departamento, alumno_id, tutor,
             motivo, fecha_inicio, tiempo_dias, req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Justificante no encontrado' });
        }
        
        res.json({ message: 'Justificante actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar un justificante
exports.deleteJustificante = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM Justificantes WHERE id = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Justificante no encontrado' });
        }
        
        res.json({ message: 'Justificante eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 