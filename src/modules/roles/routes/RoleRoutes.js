const { Router } = require('express');
const { Roles } = require('../../../constants/roles');
const { authMiddleware } = require('../../../middlewares/auth.middleware');
const { roleMiddleware } = require('../../../middlewares/role.middleware');
const { RoleController } = require('../controllers/RoleController');

const router = Router();
const roleController = new RoleController();
const adminOnly = roleMiddleware(Roles.ADMIN);

router.get('/defaults', authMiddleware, adminOnly, roleController.getDefaults.bind(roleController));
router.post('/seed', authMiddleware, adminOnly, roleController.seedDefaults.bind(roleController));
router.get(
  '/:name/permissions',
  authMiddleware,
  adminOnly,
  roleController.getPermissions.bind(roleController)
);
router.get('/', authMiddleware, adminOnly, roleController.getAll.bind(roleController));
router.get('/:id', authMiddleware, adminOnly, roleController.getById.bind(roleController));
router.post('/', authMiddleware, adminOnly, roleController.create.bind(roleController));
router.put('/:id', authMiddleware, adminOnly, roleController.update.bind(roleController));
router.delete('/:id', authMiddleware, adminOnly, roleController.delete.bind(roleController));

module.exports = router;
