const { successResponse } = require('../../../core/utils/response');
const { CategoryService } = require('../services/CategoryService');

class CategoryController {
  constructor(categoryService = new CategoryService()) {
    this.categoryService = categoryService;
  }

  async create(req, res, next) {
    try {
      const { name, description } = req.body;
      const result = await this.categoryService.create(name, description);
      return successResponse(res, result, 'Category created', 201);
    } catch (error) {
      return next(error);
    }
  }

  async findAll(_req, res, next) {
    try {
      const result = await this.categoryService.findAll();
      return successResponse(res, result, 'Categories fetched');
    } catch (error) {
      return next(error);
    }
  }

  async findOne(req, res, next) {
    try {
      const { id } = req.params;
      const result = await this.categoryService.findOne(Number(id));
      return successResponse(res, result, 'Category fetched');
    } catch (error) {
      return next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name, description, isActive } = req.body;
      const result = await this.categoryService.update(Number(id), {
        name,
        description,
        isActive
      });
      return successResponse(res, result, 'Category updated');
    } catch (error) {
      return next(error);
    }
  }

  async remove(req, res, next) {
    try {
      const { id } = req.params;
      const result = await this.categoryService.remove(Number(id));
      return successResponse(res, result, 'Category deleted');
    } catch (error) {
      return next(error);
    }
  }
}

module.exports.CategoryController = CategoryController;
