import type { NextFunction, Request, Response } from 'express';
import { successResponse } from '../../../core/utils/response';
import { CategoryService } from '../services/CategoryService';

export class CategoryController {
  categoryService: CategoryService;

  constructor(categoryService = new CategoryService()) {
    this.categoryService = categoryService;
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description } = req.body;
      const result = await this.categoryService.create(name, description);
      return successResponse(res, result, 'Category created', 201);
    } catch (error) {
      return next(error);
    }
  }

  async findAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.categoryService.findAll();
      return successResponse(res, result, 'Categories fetched');
    } catch (error) {
      return next(error);
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await this.categoryService.findOne(Number(id));
      return successResponse(res, result, 'Category fetched');
    } catch (error) {
      return next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
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

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await this.categoryService.remove(Number(id));
      return successResponse(res, result, 'Category deleted');
    } catch (error) {
      return next(error);
    }
  }
}
