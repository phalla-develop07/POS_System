const { BaseRepository } = require('../../../core/base/BaseRepository');
const { ProductSchema } = require('../models/Product');

class ProductRepository extends BaseRepository {
  constructor() {
    super(ProductSchema);
  }

  createProduct(productData) {
    const product = this.repository.create(productData);
    return this.repository.save(product);
  }

  async updateProduct(id, productData) {
    const product = await this.findById(id);
    if (!product) {
      return null;
    }

    Object.assign(product, productData);
    return this.repository.save(product);
  }

  async deleteProduct(id) {
    const product = await this.findById(id);
    if (!product) {
      return null;
    }

    return this.repository.remove(product);
  }
}

module.exports.ProductRepository = ProductRepository;
