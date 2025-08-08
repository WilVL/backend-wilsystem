const pool = require('../config/db.config');

// Obtener todos los justificantes
exports.getAllJustificantes = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT j.*, j.creado_por, a.nombre as nombre_alumno, a.grupo as grupo_alumno,
                   (SELECT COUNT(*) FROM Justificantes 
                    WHERE alumno_id = j.alumno_id 
                    AND MONTH(fecha_inicio) = MONTH(CURDATE()) 
                    AND YEAR(fecha_inicio) = YEAR(CURDATE())) as total_justificantes
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
            SELECT j.*, j.creado_por, a.nombre as nombre_alumno, a.grupo as grupo_alumno,
                   (SELECT COUNT(*) FROM Justificantes 
                    WHERE alumno_id = j.alumno_id 
                    AND MONTH(fecha_inicio) = MONTH(CURDATE()) 
                    AND YEAR(fecha_inicio) = YEAR(CURDATE())) as total_justificantes
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
            fecha_regreso,
            tiempo_dias
        } = req.body;

        // Validar traslape de fechas para el mismo alumno
        const [overlap] = await pool.query(
            `SELECT * FROM Justificantes 
             WHERE alumno_id = ? 
             AND (
                 (fecha_inicio <= ? AND fecha_regreso >= ?)
             )`,
            [alumno_id, fecha_regreso, fecha_inicio]
        );
        if (overlap.length > 0) {
            return res.status(400).json({ message: 'El alumno ya tiene un justificante que abarca parte o todo ese periodo.' });
        }

        const [result] = await pool.query(
            `INSERT INTO Justificantes (
                tipo_justificante, departamento, alumno_id, tutor, 
                motivo, fecha_inicio, fecha_regreso, tiempo_dias, creado_por
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [tipo_justificante, departamento, alumno_id, tutor, 
             motivo, fecha_inicio, fecha_regreso, tiempo_dias, req.user.id]
        );
        
        res.status(201).json({
            id: result.insertId,
            ...req.body,
            creado_por: req.user.id
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
            fecha_regreso,
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
                fecha_regreso = ?,
                tiempo_dias = ?
            WHERE id = ?`,
            [tipo_justificante, departamento, alumno_id, tutor,
             motivo, fecha_inicio, fecha_regreso, tiempo_dias, req.params.id]
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