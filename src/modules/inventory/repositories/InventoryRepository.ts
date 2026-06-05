import { AppDataSource } from '../../../database/data-source';
import { ProductSchema, type Product } from '../models/Product';
import { InventoryTransactionSchema, type InventoryTransaction } from '../models/InventoryTransaction';
import { InventoryLogSchema, type InventoryLog } from '../models/InventoryLog';

export class InventoryRepository {
  productRepository = AppDataSource.getRepository(ProductSchema);
  transactionRepository = AppDataSource.getRepository(InventoryTransactionSchema);
  logRepository = AppDataSource.getRepository(InventoryLogSchema);

  findAllProducts() {
    return this.productRepository
      .createQueryBuilder('product')
      .orderBy('product.isActive', 'DESC')
      .addOrderBy('product.updatedAt', 'DESC')
      .getMany();
  }

  findProductById(id: number) {
    return this.productRepository.findOneBy({ id });
  }

  findProductBySku(sku: string) {
    return this.productRepository.findOneBy({ sku });
  }

  saveProduct(product: Product) {
    return this.productRepository.save(product);
  }

  createProduct(productData: Partial<Product>) {
    return this.productRepository.save(this.productRepository.create(productData));
  }

  createTransaction(transactionData: Partial<InventoryTransaction>) {
    return this.transactionRepository.save(this.transactionRepository.create(transactionData));
  }

  createLog(logData: Partial<InventoryLog>) {
    return this.logRepository.save(this.logRepository.create(logData));
  }

  findTransactions({ productId, limit = 50, offset = 0 }: { productId?: number | null; limit?: number; offset?: number }) {
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

  findLogs({
    productId,
    userId,
    actionType,
    limit = 50,
    offset = 0
  }: {
    productId?: number | null;
    userId?: number | null;
    actionType?: string | null;
    limit?: number;
    offset?: number;
  }) {
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
