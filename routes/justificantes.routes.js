const express = require('express');
const router = express.Router();
const justificantesController = require('../controllers/justificantes.controller');

// Rutas CRUD para justificantes
router.get('/', justificantesController.getAllJustificantes);
router.get('/:id', justificantesController.getJustificanteById);
router.post('/', justificantesController.createJustificante);
router.put('/:id', justificantesController.updateJustificante);
router.delete('/:id', justificantesController.deleteJustificante);

module.exports = router; 