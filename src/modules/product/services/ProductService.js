const { AppError } = require('../../../core/errors/AppError');
const { ProductRepository } = require('../repositories/ProductRepository');

class ProductService {
  constructor(productRepository = new ProductRepository()) {
    this.productRepository = productRepository;
  }

  listProducts() {
    return this.productRepository.findAll();
  }

  async getProduct(id) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    return product;
  }

  createProduct(productData) {
    return this.productRepository.createProduct(productData);
  }

  async updateProduct(id, productData) {
    const product = await this.productRepository.updateProduct(id, productData);
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    return product;
  }

  async deleteProduct(id) {
    const product = await this.productRepository.deleteProduct(id);
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    return product;
  }
}

module.exports.ProductService = ProductService;
