const pool = require('../config/db.config');

// Obtener todas las entradas y salidas
exports.getAllEntradasSalidas = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT es.id, es.nombre_visita, es.alumno_id, es.motivo, es.tipo, 
                   DATE_FORMAT(es.fecha_registro, '%Y-%m-%d %H:%i:%s') as fecha_registro,
                   a.nombre as nombre_alumno, a.grupo as grupo_alumno
            FROM EntradasSalidas es 
            LEFT JOIN Alumnos a ON es.alumno_id = a.id
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener una entrada/salida por ID
exports.getEntradaSalidaById = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT es.id, es.nombre_visita, es.alumno_id, es.motivo, es.tipo,
                   DATE_FORMAT(es.fecha_registro, '%Y-%m-%d %H:%i:%s') as fecha_registro,
                   a.nombre as nombre_alumno, a.grupo as grupo_alumno
            FROM EntradasSalidas es 
            LEFT JOIN Alumnos a ON es.alumno_id = a.id 
            WHERE es.id = ?
        `, [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear una nueva entrada/salida
exports.createEntradaSalida = async (req, res) => {
    try {
        const {
            nombre_visita,
            alumno_id,
            motivo,
            tipo
        } = req.body;

        const [result] = await pool.query(
            `INSERT INTO EntradasSalidas (
                nombre_visita, alumno_id, motivo, tipo
            ) VALUES (?, ?, ?, ?)`,
            [nombre_visita, alumno_id, motivo, tipo]
        );
        
        // Obtener el registro recién creado con la fecha formateada
        const [newRecord] = await pool.query(`
            SELECT id, nombre_visita, alumno_id, motivo, tipo,
                   DATE_FORMAT(fecha_registro, '%Y-%m-%d %H:%i:%s') as fecha_registro
            FROM EntradasSalidas WHERE id = ?
        `, [result.insertId]);
        
        res.status(201).json(newRecord[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar una entrada/salida
exports.updateEntradaSalida = async (req, res) => {
    try {
        const {
            nombre_visita,
            alumno_id,
            motivo,
            tipo
        } = req.body;

        const [result] = await pool.query(
            `UPDATE EntradasSalidas SET 
                nombre_visita = ?,
                alumno_id = ?,
                motivo = ?,
                tipo = ?
            WHERE id = ?`,
            [nombre_visita, alumno_id, motivo, tipo, req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }
        
        res.json({ message: 'Registro actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar una entrada/salida
exports.deleteEntradaSalida = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM EntradasSalidas WHERE id = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }
        
        res.json({ message: 'Registro eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 