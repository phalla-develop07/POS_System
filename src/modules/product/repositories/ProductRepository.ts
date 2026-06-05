import { BaseRepository } from '../../../core/base/BaseRepository';
import { ProductSchema, type Product } from '../models/Product';

export class ProductRepository extends BaseRepository<Product> {
  constructor() {
    super(ProductSchema);
  }

  createProduct(productData: Partial<Product>) {
    const product = this.repository.create(productData);
    return this.repository.save(product);
  }

  async updateProduct(id: number, productData: Partial<Product>) {
    const product = await this.findById(id);
    if (!product) {
      return null;
    }

    Object.assign(product, productData);
    return this.repository.save(product);
  }

  async deleteProduct(id: number) {
    const product = await this.findById(id);
    if (!product) {
      return null;
    }

    return this.repository.remove(product);
  }
}
