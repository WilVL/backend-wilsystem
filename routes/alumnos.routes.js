const express = require('express');
const router = express.Router();
const alumnosController = require('../controllers/alumnos.controller');

// Rutas CRUD para alumnos
router.get('/', alumnosController.getAllAlumnos);
router.get('/:id', alumnosController.getAlumnoById);
router.post('/', alumnosController.createAlumno);
router.put('/:id', alumnosController.updateAlumno);
router.delete('/:id', alumnosController.deleteAlumno);

module.exports = router; 