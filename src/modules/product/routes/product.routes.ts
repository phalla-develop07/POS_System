import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { ProductController } from '../controllers/ProductController';
import { validateCreateProduct, validateUpdateProduct } from '../validators/product.validator';

const router = Router();
const productController = new ProductController();

const uploadDirectory = path.join(__dirname, '../../../../uploads');

const storage = multer.diskStorage({
  destination: uploadDirectory,
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname) || '';
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
    cb(null, safeName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.get('/', productController.list.bind(productController));
router.get('/:id', productController.view.bind(productController));
router.post('/', upload.single('image'), validateCreateProduct, productController.create.bind(productController));
router.put('/:id', upload.single('image'), validateUpdateProduct, productController.update.bind(productController));
router.delete('/:id', productController.delete.bind(productController));

export default router;
