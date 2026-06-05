import { AppError } from '../../../core/errors/AppError';
import { CategoryRepository } from '../repositories/CategoryRepository';
import type { Category } from '../models/Category';

export class CategoryService {
  categoryRepository: CategoryRepository;

  constructor(categoryRepository = new CategoryRepository()) {
    this.categoryRepository = categoryRepository;
  }

  async create(name: string, description: string | null = null) {
    const existingCategory = await this.categoryRepository.findByName(name);

    if (existingCategory) {
      throw new AppError('Category already exists', 409);
    }

    const category = await this.categoryRepository.createCategory({
      name,
      description
    });

    return category;
  }

  async findAll() {
    return this.categoryRepository.findAll();
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    return category;
  }

  async update(id: number, data: Partial<Category>) {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    if (data.name && data.name !== category.name) {
      const existingCategory = await this.categoryRepository.findByName(data.name);

      if (existingCategory) {
        throw new AppError('Category already exists', 409);
      }
    }

    await this.categoryRepository.updateCategory(id, data);

    return this.categoryRepository.findById(id);
  }

  async remove(id: number) {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    await this.categoryRepository.deleteCategory(id);

    return { deleted: true };
  }
}
