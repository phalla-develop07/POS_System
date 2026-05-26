const { Router } = require('express');
const authRoutes = require('../modules/auth/routes/auth.routes');
const categoryRoutes = require('../modules/category/routes/category.routes');

const router = Router();

router.get('/', (_req, res) => {
  res.json({ success: true, message: 'API is running' });
});

router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);

module.exports = router;
