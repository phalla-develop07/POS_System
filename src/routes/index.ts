import { Router } from 'express';
import authRoutes from '../modules/auth/routes/auth.routes';
import permissionsRoutes from '../modules/permissions/routes/PermissionRoutes';
import rolesRoutes from '../modules/roles/routes/RoleRoutes';
import productRoutes from '../modules/product/routes/product.routes';
import categoryRoutes from '../modules/category/routes/category.routes';
import inventoryRoutes from '../modules/inventory/routes/inventory.routes';
import saleRoutes from '../modules/sales/routes/sale.routes';

const router = Router();
const routeModules: Array<[string, ReturnType<typeof Router>]> = [
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

export default router;
