const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const authMiddleware = require('../middleware/auth');
const { roleAuth, ROLES } = require('../middleware/roleAuth');

// Ruta de login
router.post('/login', usersController.login);

// Ruta para crear usuario inicial (sin autenticación)
router.post('/initial', usersController.createInitialUser);

// Rutas CRUD para usuarios (solo Direccion)
router.get('/', authMiddleware, roleAuth(ROLES.ADMIN_ONLY), usersController.getAllUsers);
router.get('/:id', authMiddleware, roleAuth(ROLES.ADMIN_ONLY), usersController.getUserById);
router.post('/', authMiddleware, roleAuth(ROLES.ADMIN_ONLY), usersController.createUser);
router.put('/:id', authMiddleware, roleAuth(ROLES.ADMIN_ONLY), usersController.updateUser);
router.delete('/:id', authMiddleware, roleAuth(ROLES.ADMIN_ONLY), usersController.deleteUser);

module.exports = router; 