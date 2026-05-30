const { Router } = require('express');
const { Roles } = require('../../../constants/roles');
const { authMiddleware } = require('../../../middlewares/auth.middleware');
const { roleMiddleware } = require('../../../middlewares/role.middleware');
const { PermissionController } = require('../controllers/PermissionController');

const router = Router();
const permissionController = new PermissionController();
const adminOnly = roleMiddleware(Roles.ADMIN);

router.get(
  '/defaults',
  authMiddleware,
  adminOnly,
  permissionController.getDefaults.bind(permissionController)
);
router.post(
  '/seed',
  authMiddleware,
  adminOnly,
  permissionController.seedDefaults.bind(permissionController)
);
router.get('/', authMiddleware, adminOnly, permissionController.getAll.bind(permissionController));
router.get('/:id', authMiddleware, adminOnly, permissionController.getById.bind(permissionController));
router.post('/', authMiddleware, adminOnly, permissionController.create.bind(permissionController));
router.put('/:id', authMiddleware, adminOnly, permissionController.update.bind(permissionController));
router.delete('/:id', authMiddleware, adminOnly, permissionController.delete.bind(permissionController));

module.exports = router;
