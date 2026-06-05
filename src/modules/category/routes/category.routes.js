const { Router } = require('express');
const { CategoryController } = require('../controllers/CategoryController');
const { validateBody } = require('../../../middlewares/validation.middleware');
const { validateCreateCategory, validateUpdateCategory } = require('../validators/category.validator');

const router = Router();
const categoryController = new CategoryController();

router.get('/', categoryController.findAll.bind(categoryController));
router.get('/:id', categoryController.findOne.bind(categoryController));
router.post('/', validateBody(['name']), validateCreateCategory, categoryController.create.bind(categoryController));
router.put('/:id', validateUpdateCategory, categoryController.update.bind(categoryController));
router.delete('/:id', categoryController.remove.bind(categoryController));

module.exports = router;
