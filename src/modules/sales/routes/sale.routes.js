const { Router } = require('express');
const { SaleController } = require('../controllers/SaleController');

const router = Router();
const saleController = new SaleController();

router.get('/search', saleController.search.bind(saleController));
router.post('/checkout', saleController.checkout.bind(saleController));

module.exports = router;
