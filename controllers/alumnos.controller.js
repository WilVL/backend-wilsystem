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
        const { nombre, grupo, turno, ingreso } = req.body;
        const [result] = await pool.query(
            'INSERT INTO Alumnos (nombre, grupo, turno, ingreso) VALUES (?, ?, ?, ?)',
            [nombre, grupo, turno, ingreso]
        );
        res.status(201).json({ id: result.insertId, nombre, grupo, turno, ingreso });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear varios alumnos (alta masiva)
exports.createAlumnosBulk = async (req, res) => {
    try {
        const alumnos = req.body.alumnos;
        if (!Array.isArray(alumnos) || alumnos.length === 0) {
            return res.status(400).json({ message: 'Se requiere un array de alumnos.' });
        }
        const values = alumnos.map(({ nombre, grupo, turno, ingreso }) => [nombre, grupo, turno, ingreso]);
        const [result] = await pool.query(
            'INSERT INTO Alumnos (nombre, grupo, turno, ingreso) VALUES ?'
            , [values]
        );
        // Obtener los IDs insertados
        const insertId = result.insertId;
        const insertCount = result.affectedRows;
        const alumnosCreados = alumnos.map((alumno, i) => ({
            id: insertId + i,
            ...alumno
        }));
        res.status(201).json({ alumnos: alumnosCreados });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un alumno
exports.updateAlumno = async (req, res) => {
    try {
        const { nombre, grupo, turno, ingreso } = req.body;
        const [result] = await pool.query(
            'UPDATE Alumnos SET nombre = ?, grupo = ?, turno = ?, ingreso = ? WHERE id = ?',
            [nombre, grupo, turno, ingreso, req.params.id]
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

// Eliminar todos los alumnos de un grupo (excepto los excluidos)
exports.deleteGrupo = async (req, res) => {
    try {
        const { grupo, excluirIds } = req.body;
        if (!grupo) {
            return res.status(400).json({ message: 'Grupo es requerido.' });
        }
        // Construir la condición para excluir IDs si se proporcionan
        let query = 'DELETE FROM Alumnos WHERE grupo = ?';
        let params = [grupo];
        if (Array.isArray(excluirIds) && excluirIds.length > 0) {
            query += ' AND id NOT IN (' + excluirIds.map(() => '?').join(',') + ')';
            params = params.concat(excluirIds);
        }
        const [result] = await pool.query(query, params);
        res.json({ message: 'Grupo eliminado correctamente', affectedRows: result.affectedRows });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el grupo', error });
    }
}; 

// Actualizar todos los alumnos de un grupo (excepto los excluidos)
exports.updateGrupo = async (req, res) => {
    try {
        const { grupo, nuevoGrupo, nuevoIngreso, excluirIds } = req.body;
        if (!grupo) {
            return res.status(400).json({ message: 'Grupo es requerido.' });
        }
        if (!nuevoGrupo && !nuevoIngreso) {
            return res.status(400).json({ message: 'Debes especificar al menos un campo a actualizar (nuevoGrupo o nuevoIngreso).' });
        }
        let setParts = [];
        let params = [];
        if (nuevoGrupo) {
            setParts.push('grupo = ?');
            params.push(nuevoGrupo);
        }
        if (nuevoIngreso) {
            setParts.push('ingreso = ?');
            params.push(nuevoIngreso);
        }
        let query = `UPDATE Alumnos SET ${setParts.join(', ')} WHERE grupo = ?`;
        params.push(grupo);
        if (Array.isArray(excluirIds) && excluirIds.length > 0) {
            query += ' AND id NOT IN (' + excluirIds.map(() => '?').join(',') + ')';
            params = params.concat(excluirIds);
        }
        const [result] = await pool.query(query, params);
        res.json({ message: 'Grupo actualizado correctamente', affectedRows: result.affectedRows });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el grupo', error });
    }
}; 