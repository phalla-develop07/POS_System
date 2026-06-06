import { AppError } from '../../../core/errors/AppError';
import { ProductRepository } from '../repositories/ProductRepository';
import type { Product } from '../models/Product';

export class ProductService {
  productRepository: ProductRepository;

  constructor(productRepository = new ProductRepository()) {
    this.productRepository = productRepository;
  }

  listProducts() {
    return this.productRepository.findAll();
  }

  async getProduct(id: number) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    return product;
  }

  createProduct(productData: Partial<Product>) {
    return this.productRepository.createProduct(productData);
  }

  async updateProduct(id: number, productData: Partial<Product>) {
    const product = await this.productRepository.updateProduct(id, productData);
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    return product;
  }

  async deleteProduct(id: number) {
    const product = await this.productRepository.deleteProduct(id);
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    return product;
  }
}
