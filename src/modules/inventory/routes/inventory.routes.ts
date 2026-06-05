import { Router } from 'express';
import { InventoryController } from '../controllers/InventoryController';
import { authMiddleware } from '../../../middlewares/auth.middleware';
import { roleMiddleware } from '../../../middlewares/role.middleware';
import { Roles } from '../../../constants/roles';
import {
  validateCreateProduct,
  validateStockUpdate,
  validateUpdateProduct
} from '../validators/inventory.validator';

const router = Router();
const inventoryController = new InventoryController();

router.use(authMiddleware);

router.get('/products', inventoryController.listProducts.bind(inventoryController));
router.get('/products/:id', inventoryController.getProduct.bind(inventoryController));
router.get('/low-stock', inventoryController.listLowStockAlerts.bind(inventoryController));
router.get('/history', inventoryController.listHistory.bind(inventoryController));
router.get('/logs', inventoryController.listLogs.bind(inventoryController));

router.post(
  '/products',
  roleMiddleware(Roles.ADMIN, Roles.MANAGER),
  validateCreateProduct,
  inventoryController.createProduct.bind(inventoryController)
);

router.patch(
  '/products/:id',
  roleMiddleware(Roles.ADMIN, Roles.MANAGER),
  validateUpdateProduct,
  inventoryController.updateProduct.bind(inventoryController)
);

router.post(
  '/products/:id/stock',
  roleMiddleware(Roles.ADMIN, Roles.MANAGER),
  validateStockUpdate,
  inventoryController.adjustStock.bind(inventoryController)
);

export default router;
