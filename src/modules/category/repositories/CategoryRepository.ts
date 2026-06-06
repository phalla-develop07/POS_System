import { BaseRepository } from '../../../core/base/BaseRepository';
import { CategorySchema, type Category } from '../models/Category';

export class CategoryRepository extends BaseRepository<Category> {
  constructor() {
    super(CategorySchema);
  }

  findByName(name: string) {
    return this.repository.findOne({ where: { name } });
  }

  createCategory(categoryData: Partial<Category>) {
    const category = this.repository.create(categoryData);
    return this.repository.save(category);
  }

  updateCategory(id: number, categoryData: Partial<Category>) {
    return this.repository.update({ id }, categoryData);
  }

  deleteCategory(id: number) {
    return this.repository.delete({ id });
  }
}
