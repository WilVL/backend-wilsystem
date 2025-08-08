const express = require('express');
const router = express.Router();
const alumnosController = require('../controllers/alumnos.controller');
const authMiddleware = require('../middleware/auth');
const { roleAuth, ROLES } = require('../middleware/roleAuth');

// Consultar alumnos: todos los roles autenticados
router.get('/', authMiddleware, roleAuth(ROLES.ALL), alumnosController.getAllAlumnos);
router.get('/:id', authMiddleware, roleAuth(ROLES.ALL), alumnosController.getAlumnoById);

// Crear, editar y eliminar: solo Direccion
router.post('/', authMiddleware, roleAuth(ROLES.ADMIN_ONLY), alumnosController.createAlumno);
router.post('/bulk', authMiddleware, roleAuth(ROLES.ADMIN_ONLY), alumnosController.createAlumnosBulk);
router.put('/grupo', authMiddleware, roleAuth(ROLES.ADMIN_ONLY), alumnosController.updateGrupo);
router.put('/:id', authMiddleware, roleAuth(ROLES.ADMIN_ONLY), alumnosController.updateAlumno);
router.delete('/grupo', authMiddleware, roleAuth(ROLES.ADMIN_ONLY), alumnosController.deleteGrupo);
router.delete('/:id', authMiddleware, roleAuth(ROLES.ADMIN_ONLY), alumnosController.deleteAlumno);


module.exports = router; 