const { AppDataSource } = require('../../../database/data-source');
const { ProductSchema } = require('../models/Product');
const { InventoryTransactionSchema } = require('../models/InventoryTransaction');
const { InventoryLogSchema } = require('../models/InventoryLog');

class InventoryRepository {
  constructor() {
    this.productRepository = AppDataSource.getRepository(ProductSchema);
    this.transactionRepository = AppDataSource.getRepository(InventoryTransactionSchema);
    this.logRepository = AppDataSource.getRepository(InventoryLogSchema);
  }

  findAllProducts() {
    return this.productRepository
      .createQueryBuilder('product')
      .orderBy('product.isActive', 'DESC')
      .addOrderBy('product.updatedAt', 'DESC')
      .getMany();
  }

  findProductById(id) {
    return this.productRepository.findOneBy({ id });
  }

  findProductBySku(sku) {
    return this.productRepository.findOneBy({ sku });
  }

  saveProduct(product) {
    return this.productRepository.save(product);
  }

  createProduct(productData) {
    return this.productRepository.save(this.productRepository.create(productData));
  }

  createTransaction(transactionData) {
    return this.transactionRepository.save(this.transactionRepository.create(transactionData));
  }

  createLog(logData) {
    return this.logRepository.save(this.logRepository.create(logData));
  }

  findTransactions({ productId, limit = 50, offset = 0 }) {
    const query = this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.product', 'product')
      .orderBy('transaction.createdAt', 'DESC')
      .take(limit)
      .skip(offset);

    if (productId) {
      query.where('product.id = :productId', { productId });
    }

    return query.getMany();
  }

  findLogs({ productId, userId, actionType, limit = 50, offset = 0 }) {
    const query = this.logRepository
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.product', 'product')
      .leftJoinAndSelect('log.user', 'user')
      .orderBy('log.createdAt', 'DESC')
      .take(limit)
      .skip(offset);

    if (productId) {
      query.andWhere('product.id = :productId', { productId });
    }

    if (userId) {
      query.andWhere('user.id = :userId', { userId });
    }

    if (actionType) {
      query.andWhere('log.actionType = :actionType', { actionType });
    }

    return query.getMany();
  }

  async findLowStockProducts() {
    return this.productRepository
      .createQueryBuilder('product')
      .where('product.isActive = :isActive', { isActive: true })
      .andWhere('product.stock <= product.lowStockThreshold')
      .orderBy('product.stock', 'ASC')
      .addOrderBy('product.updatedAt', 'DESC')
      .getMany();
  }
}

module.exports.InventoryRepository = InventoryRepository;
