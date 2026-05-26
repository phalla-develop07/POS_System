const { BaseRepository } = require('../../../core/base/BaseRepository');
const { CategorySchema } = require('../models/Category');

class CategoryRepository extends BaseRepository {
  constructor() {
    super(CategorySchema);
  }

  findByName(name) {
    return this.repository.findOne({ where: { name } });
  }

  createCategory(categoryData) {
    const category = this.repository.create(categoryData);
    return this.repository.save(category);
  }

  updateCategory(id, categoryData) {
    return this.repository.update({ id }, categoryData);
  }

  deleteCategory(id) {
    return this.repository.delete({ id });
  }
}

module.exports.CategoryRepository = CategoryRepository;
