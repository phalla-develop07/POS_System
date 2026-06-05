const { Router } = require('express');
const authRoutes = require('../modules/auth/routes/auth.routes');
const permissionsRoutes = require('../modules/permissions/routes/PermissionRoutes');
const rolesRoutes = require('../modules/roles/routes/RoleRoutes');
const productRoutes = require('../modules/product/routes/product.routes');
const categoryRoutes = require('../modules/category/routes/category.routes');

const router = Router();

router.get('/', (_req, res) => {
  res.json({ success: true, message: 'API is running' });
});

router.use('/auth', authRoutes);
router.use('/permissions', permissionsRoutes);
router.use('/roles', rolesRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);

module.exports = router;
