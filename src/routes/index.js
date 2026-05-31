const { Router } = require('express');
const authRoutes = require('../modules/auth/routes/auth.routes');
const productRoutes = require('../modules/product/routes/product.routes');

const router = Router();

router.get('/', (_req, res) => {
  res.json({ success: true, message: 'API is running' });
});

router.use('/auth', authRoutes);
router.use('/products', productRoutes);

module.exports = router;
