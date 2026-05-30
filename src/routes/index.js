const { Router } = require('express');
const authRoutes = require('../modules/auth/routes/auth.routes');
const permissionsRoutes = require('../modules/permissions/routes/PermissionRoutes');
const rolesRoutes = require('../modules/roles/routes/RoleRoutes');

const router = Router();

router.get('/', (_req, res) => {
  res.json({ success: true, message: 'API is running' });
});

router.use('/auth', authRoutes);
router.use('/roles', rolesRoutes);
router.use('/permissions', permissionsRoutes);

module.exports = router;
