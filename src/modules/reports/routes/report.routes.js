const { Router } = require('express');
const { ReportController } = require('../controllers/ReportController');
const { authMiddleware } = require('../../../middlewares/auth.middleware');
const { roleMiddleware } = require('../../../middlewares/role.middleware');
const { Roles } = require('../../../constants/roles');

const router = Router();
const reportController = new ReportController();

router.use(authMiddleware);

router.get(
  '/monthly-revenue',
  roleMiddleware(Roles.ADMIN, Roles.MANAGER),
  reportController.monthlyRevenue.bind(reportController)
);

router.get(
  '/best-selling-products',
  roleMiddleware(Roles.ADMIN, Roles.MANAGER),
  reportController.bestSellingProducts.bind(reportController)
);

router.get(
  '/employee-performance',
  roleMiddleware(Roles.ADMIN, Roles.MANAGER),
  reportController.employeePerformance.bind(reportController)
);

module.exports = router;
