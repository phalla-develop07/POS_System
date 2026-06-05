const { AppError } = require('../../../core/errors/AppError');
const { AppDataSource } = require('../../../database/data-source');
const { ProductRepository } = require('../../product/repositories/ProductRepository');
const { ProductSchema } = require('../../product/models/Product');

class SaleService {
  constructor(productRepository = new ProductRepository()) {
    this.productRepository = productRepository;
  }

  async searchProducts(query = '') {
    const products = await this.productRepository.findAll();
    const normalizedQuery = query.toLowerCase();

    if (!normalizedQuery) {
      return products;
    }

    return products.filter((product) => {
      return [product.name, product.description || '']
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }

  async checkout(payload = {}) {
    const items = Array.isArray(payload.items) ? payload.items : [];
    const paymentAmount = Number(payload.paymentAmount || 0);

    if (!items.length) {
      throw new AppError('Add at least one product to the cart before checkout.', 400);
    }

    const cart = [];

    for (const item of items) {
      const productId = Number(item.id);
      const quantity = Number(item.quantity || 1);

      if (!Number.isFinite(productId) || productId <= 0) {
        throw new AppError('Each cart item must include a valid product id.', 400);
      }

      if (!Number.isFinite(quantity) || quantity < 1 || !Number.isInteger(quantity)) {
        throw new AppError('Each cart item quantity must be a positive integer.', 400);
      }

      const product = await this.productRepository.findById(productId);
      if (!product) {
        throw new AppError(`Product with id ${productId} was not found.`, 404);
      }

      if (product.stock < quantity) {
        throw new AppError(`Not enough stock for ${product.name}. Available: ${product.stock}`, 400);
      }

      cart.push({ product, quantity });
    }

    const subtotal = cart.reduce((sum, entry) => {
      return sum + Number(entry.product.price) * entry.quantity;
    }, 0);

    const total = Number(subtotal.toFixed(2));

    if (!Number.isFinite(paymentAmount) || paymentAmount < total) {
      throw new AppError('Payment amount is less than the total due.', 400);
    }

    const receiptNumber = `RCP-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;

    await AppDataSource.transaction(async (manager) => {
      for (const entry of cart) {
        await manager.getRepository(ProductSchema).update(entry.product.id, {
          stock: entry.product.stock - entry.quantity
        });
      }
    });

    const change = Number((paymentAmount - total).toFixed(2));

    return {
      receiptNumber,
      status: 'PAID',
      generatedAt: new Date().toISOString(),
      paymentAmount,
      total,
      change,
      items: cart.map((entry) => ({
        id: entry.product.id,
        name: entry.product.name,
        price: Number(entry.product.price),
        quantity: entry.quantity,
        lineTotal: Number((Number(entry.product.price) * entry.quantity).toFixed(2))
      }))
    };
  }
}

module.exports.SaleService = SaleService;
