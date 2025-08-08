const express = require('express');
const router = express.Router();
const entradasSalidasController = require('../controllers/entradasSalidas.controller');
const authMiddleware = require('../middleware/auth');
const { roleAuth, ROLES } = require('../middleware/roleAuth');

// Rutas CRUD para entradas y salidas (Direccion + Prefecto + Maestro + Trabajo Social)
router.get('/', authMiddleware, roleAuth(ROLES.ENTRADAS_SALIDAS), entradasSalidasController.getAllEntradasSalidas);
router.get('/:id', authMiddleware, roleAuth(ROLES.ENTRADAS_SALIDAS), entradasSalidasController.getEntradaSalidaById);
router.post('/', authMiddleware, roleAuth(ROLES.ENTRADAS_SALIDAS), entradasSalidasController.createEntradaSalida);
router.put('/:id', authMiddleware, roleAuth(ROLES.ENTRADAS_SALIDAS), entradasSalidasController.updateEntradaSalida);
router.delete('/:id', authMiddleware, roleAuth(ROLES.ENTRADAS_SALIDAS), entradasSalidasController.deleteEntradaSalida);

module.exports = router; 