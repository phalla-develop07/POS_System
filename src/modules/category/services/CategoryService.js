const { AppError } = require('../../../core/errors/AppError');
const { CategoryRepository } = require('../repositories/CategoryRepository');

class CategoryService {
  constructor(categoryRepository = new CategoryRepository()) {
    this.categoryRepository = categoryRepository;
  }

  async create(name, description = null, image = null) {
    const existingCategory = await this.categoryRepository.findByName(name);

    if (existingCategory) {
      throw new AppError('Category already exists', 409);
    }

    const category = await this.categoryRepository.createCategory({
      name,
      description,
      image
    });

    return category;
  }

  async findAll() {
    return this.categoryRepository.findAll();
  }

  async findOne(id) {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    return category;
  }

  async update(id, data) {
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

  async remove(id) {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    await this.categoryRepository.deleteCategory(id);

    return { deleted: true };
  }
}

module.exports.CategoryService = CategoryService;
