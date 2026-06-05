import { Router } from 'express';
import { SaleController } from '../controllers/SaleController';

const router = Router();
const saleController = new SaleController();

router.get('/search', saleController.search.bind(saleController));
router.post('/checkout', saleController.checkout.bind(saleController));

export default router;
