import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController';
import { validateBody } from '../../../middlewares/validation.middleware';
import { validateCreateCategory, validateUpdateCategory } from '../validators/category.validator';

const router = Router();
const categoryController = new CategoryController();

router.get('/', categoryController.findAll.bind(categoryController));
router.get('/:id', categoryController.findOne.bind(categoryController));
router.post('/', validateBody(['name']), validateCreateCategory, categoryController.create.bind(categoryController));
router.put('/:id', validateUpdateCategory, categoryController.update.bind(categoryController));
router.delete('/:id', categoryController.remove.bind(categoryController));

export default router;
