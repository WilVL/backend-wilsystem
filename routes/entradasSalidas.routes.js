const express = require('express');
const router = express.Router();
const entradasSalidasController = require('../controllers/entradasSalidas.controller');

// Rutas CRUD para entradas y salidas
router.get('/', entradasSalidasController.getAllEntradasSalidas);
router.get('/:id', entradasSalidasController.getEntradaSalidaById);
router.post('/', entradasSalidasController.createEntradaSalida);
router.put('/:id', entradasSalidasController.updateEntradaSalida);
router.delete('/:id', entradasSalidasController.deleteEntradaSalida);

module.exports = router; 