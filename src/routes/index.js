const { Router } = require('express');
const authRoutes = require('../modules/auth/routes/auth.routes');
const permissionsRoutes = require('../modules/permissions/routes/PermissionRoutes');
const rolesRoutes = require('../modules/roles/routes/RoleRoutes');
const productRoutes = require('../modules/product/routes/product.routes');
const categoryRoutes = require('../modules/category/routes/category.routes');
const inventoryRoutes = require('../modules/inventory/routes/inventory.routes');
const saleRoutes = require('../modules/sales/routes/sale.routes');

const router = Router();
const routeModules = [
  ['/auth', authRoutes],
  ['/permissions', permissionsRoutes],
  ['/roles', rolesRoutes],
  ['/products', productRoutes],
  ['/categories', categoryRoutes],
  ['/inventory', inventoryRoutes],
  ['/sales', saleRoutes]
];

router.get('/', (_req, res) => {
  res.json({ success: true, message: 'API is running' });
});

for (const [path, routes] of routeModules) {
  router.use(path, routes);
}

module.exports = router;
