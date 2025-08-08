const express = require('express');
const router = express.Router();
const justificantesController = require('../controllers/justificantes.controller');
const authMiddleware = require('../middleware/auth');
const { roleAuth, ROLES } = require('../middleware/roleAuth');

// Rutas CRUD para justificantes (Direccion + Prefecto + Maestro)
router.get('/', authMiddleware, roleAuth(ROLES.MAESTRO_AND_UP), justificantesController.getAllJustificantes);
router.get('/:id', authMiddleware, roleAuth(ROLES.MAESTRO_AND_UP), justificantesController.getJustificanteById);
router.post('/', authMiddleware, roleAuth(ROLES.MAESTRO_AND_UP), justificantesController.createJustificante);
router.put('/:id', authMiddleware, roleAuth(ROLES.MAESTRO_AND_UP), justificantesController.updateJustificante);
router.delete('/:id', authMiddleware, roleAuth(ROLES.MAESTRO_AND_UP), justificantesController.deleteJustificante);

module.exports = router; 