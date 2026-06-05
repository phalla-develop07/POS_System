const { Router } = require('express');
const authRoutes = require('../modules/auth/routes/auth.routes');
const inventoryRoutes = require('../modules/inventory/routes/inventory.routes');
const reportRoutes = require('../modules/reports/routes/report.routes');

const router = Router();

router.get('/', (_req, res) => {
  res.json({ success: true, message: 'API is running' });
});

router.use('/auth', authRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/reports', reportRoutes);

module.exports = router;
