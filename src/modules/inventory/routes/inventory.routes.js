const { Router } = require('express');
const { InventoryController } = require('../controllers/InventoryController');
const { authMiddleware } = require('../../../middlewares/auth.middleware');
const { roleMiddleware } = require('../../../middlewares/role.middleware');
const { Roles } = require('../../../constants/roles');
const {
  validateCreateProduct,
  validateStockUpdate,
  validateUpdateProduct
} = require('../validators/inventory.validator');

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

module.exports = router;
