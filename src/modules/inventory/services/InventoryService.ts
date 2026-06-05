import { AppError } from '../../../core/errors/AppError';
import { AppDataSource } from '../../../database/data-source';
import { InventoryRepository } from '../repositories/InventoryRepository';
import { ProductSchema, type Product } from '../models/Product';
import { InventoryTransactionSchema, type InventoryTransaction } from '../models/InventoryTransaction';
import { InventoryLogSchema, type InventoryLog } from '../models/InventoryLog';
import type { AuthUserPayload } from '../../../types/express';

interface NormalizedUser {
  userId: number;
  email: string | null;
  role: string | null;
}

export class InventoryService {
  inventoryRepository: InventoryRepository;

  constructor(inventoryRepository = new InventoryRepository()) {
    this.inventoryRepository = inventoryRepository;
  }

  normalizeProduct(product: Product) {
    const stock = Number(product.stock || 0);
    const lowStockThreshold = Number(product.lowStockThreshold || 0);

    return {
      ...product,
      currentStock: stock,
      stockStatus: stock <= lowStockThreshold ? 'LOW_STOCK' : 'IN_STOCK',
      isLowStock: stock <= lowStockThreshold
    };
  }

  parseId(id: unknown, label = 'id') {
    const parsedId = Number(id);

    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      throw new AppError(`Invalid ${label}`, 400);
    }

    return parsedId;
  }

  parseInteger(value: unknown, label: string, { allowZero = true } = {}) {
    const parsedValue = Number(value);

    if (!Number.isInteger(parsedValue) || parsedValue < 0 || (!allowZero && parsedValue === 0)) {
      throw new AppError(`Invalid ${label}`, 400);
    }

    return parsedValue;
  }

  normalizeString(value: unknown) {
    if (typeof value !== 'string') {
      return '';
    }

    return value.trim();
  }

  normalizeActionType(value: unknown) {
    return this.normalizeString(value).toUpperCase();
  }

  normalizeUser(user: AuthUserPayload | undefined): NormalizedUser {
    if (!user || typeof user !== 'object') {
      throw new AppError('Unauthorized', 401);
    }

    const userId = this.parseId(user.userId, 'user id');

    return {
      userId,
      email: this.normalizeString(user.email) || null,
      role: this.normalizeString(user.role) || null
    };
  }

  normalizeLog(log: InventoryLog) {
    return {
      id: log.id,
      actionType: log.actionType,
      quantity: log.quantity,
      note: log.note,
      createdAt: log.createdAt,
      product: log.product
        ? {
            id: log.product.id,
            sku: log.product.sku,
            name: log.product.name
          }
        : null,
      user: log.user
        ? {
            id: log.user.id,
            email: log.user.email,
            role: log.user.role
          }
        : null
    };
  }

  async listProducts() {
    const products = await this.inventoryRepository.findAllProducts();
    return products.map((product) => this.normalizeProduct(product));
  }

  async getProductById(id: unknown) {
    const productId = this.parseId(id, 'product id');
    const product = await this.inventoryRepository.findProductById(productId);

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return this.normalizeProduct(product);
  }

  async createProduct(payload: Record<string, unknown>, actorUser?: AuthUserPayload) {
    const actor = this.normalizeUser(actorUser);
    const name = this.normalizeString(payload.name);
    const sku = this.normalizeString(payload.sku);
    const description = this.normalizeString(payload.description);

    if (!name || !sku) {
      throw new AppError('Product name and SKU are required', 400);
    }

    const lowStockThreshold = payload.lowStockThreshold === undefined
      ? 5
      : this.parseInteger(payload.lowStockThreshold, 'low stock threshold');

    const initialStock = payload.initialStock === undefined
      ? 0
      : this.parseInteger(payload.initialStock, 'initial stock');

    const existingProduct = await this.inventoryRepository.findProductBySku(sku);

    if (existingProduct) {
      throw new AppError('SKU already exists', 409);
    }

    const createdProduct = await AppDataSource.transaction(async (manager) => {
      const productRepository = manager.getRepository(ProductSchema);
      const transactionRepository = manager.getRepository(InventoryTransactionSchema);
      const logRepository = manager.getRepository(InventoryLogSchema);

      const product = await productRepository.save(
        productRepository.create({
          name,
          sku,
          description: description || null,
          stock: initialStock,
          lowStockThreshold,
          isActive: true
        })
      );

      if (initialStock > 0) {
        await transactionRepository.save(
          transactionRepository.create({
            product,
            movementType: 'IN',
            quantity: initialStock,
            previousStock: 0,
            newStock: initialStock,
            reason: 'Initial stock',
            reference: payload.reference ? this.normalizeString(payload.reference) : null
          })
        );
      }

      await logRepository.save(
        logRepository.create({
          product,
          user: { id: actor.userId } as never,
          actionType: 'CREATE_PRODUCT',
          quantity: initialStock,
          note: this.normalizeString(payload.note)
            || `Created product ${name}${initialStock > 0 ? ` with initial stock ${initialStock}` : ''}`
        })
      );

      return product;
    });

    return this.normalizeProduct(createdProduct);
  }

  async updateProduct(id: unknown, payload: Record<string, unknown>, actorUser?: AuthUserPayload) {
    const actor = this.normalizeUser(actorUser);
    const productId = this.parseId(id, 'product id');
    const updatedProduct = await AppDataSource.transaction(async (manager) => {
      const productRepository = manager.getRepository(ProductSchema);
      const logRepository = manager.getRepository(InventoryLogSchema);

      const product = await productRepository.findOneBy({ id: productId });

      if (!product) {
        throw new AppError('Product not found', 404);
      }

      const nextName = payload.name === undefined ? product.name : this.normalizeString(payload.name);
      const nextSku = payload.sku === undefined ? product.sku : this.normalizeString(payload.sku);
      const nextDescription = payload.description === undefined ? product.description : this.normalizeString(payload.description);
      const nextLowStockThreshold = payload.lowStockThreshold === undefined
        ? product.lowStockThreshold
        : this.parseInteger(payload.lowStockThreshold, 'low stock threshold');

      if (!nextName) {
        throw new AppError('Product name cannot be empty', 400);
      }

      if (!nextSku) {
        throw new AppError('SKU cannot be empty', 400);
      }

      if (nextSku !== product.sku) {
        const skuExists = await this.inventoryRepository.findProductBySku(nextSku);

        if (skuExists && skuExists.id !== product.id) {
          throw new AppError('SKU already exists', 409);
        }
      }

      if (payload.isActive !== undefined && typeof payload.isActive !== 'boolean') {
        throw new AppError('isActive must be a boolean', 400);
      }

      product.name = nextName;
      product.sku = nextSku;
      product.description = nextDescription || null;
      product.lowStockThreshold = nextLowStockThreshold;
      if (payload.isActive !== undefined) {
        product.isActive = payload.isActive as boolean;
      }

      const savedProduct = await productRepository.save(product);

      await logRepository.save(
        logRepository.create({
          product: savedProduct,
          user: { id: actor.userId } as never,
          actionType: 'UPDATE_PRODUCT',
          quantity: 0,
          note: this.normalizeString(payload.note)
            || `Updated product ${savedProduct.name}`
        })
      );

      return savedProduct;
    });

    return this.normalizeProduct(updatedProduct);
  }

  async adjustStock(id: unknown, payload: Record<string, unknown>, actorUser?: AuthUserPayload) {
    const actor = this.normalizeUser(actorUser);
    const productId = this.parseId(id, 'product id');
    const movementType = this.normalizeString(payload.movementType).toUpperCase();

    if (!['IN', 'OUT'].includes(movementType)) {
      throw new AppError('movementType must be IN or OUT', 400);
    }

    const quantity = this.parseInteger(payload.quantity, 'quantity', { allowZero: false });
    const reason = payload.reason === undefined ? null : this.normalizeString(payload.reason) || null;
    const reference = payload.reference === undefined ? null : this.normalizeString(payload.reference) || null;

    const result = await AppDataSource.transaction(async (manager) => {
      const productRepository = manager.getRepository(ProductSchema);
      const transactionRepository = manager.getRepository(InventoryTransactionSchema);
      const logRepository = manager.getRepository(InventoryLogSchema);

      const product = await productRepository
        .createQueryBuilder('product')
        .setLock('pessimistic_write')
        .where('product.id = :productId', { productId })
        .getOne();

      if (!product) {
        throw new AppError('Product not found', 404);
      }

      const previousStock = product.stock;
      const newStock = movementType === 'IN'
        ? previousStock + quantity
        : previousStock - quantity;

      if (newStock < 0) {
        throw new AppError('Insufficient stock for this update', 400);
      }

      product.stock = newStock;
      const savedProduct = await productRepository.save(product);

      const transaction = await transactionRepository.save(
        transactionRepository.create({
          product: savedProduct,
          movementType: movementType as 'IN' | 'OUT',
          quantity,
          previousStock,
          newStock,
          reason,
          reference
        })
      );

      const log = await logRepository.save(
        logRepository.create({
          product: savedProduct,
          user: { id: actor.userId } as never,
          actionType: movementType === 'IN' ? 'STOCK_IN' : 'STOCK_OUT',
          quantity,
          note: reason || reference || `${movementType} stock update`
        })
      );

      return {
        product: savedProduct,
        transaction,
        log
      };
    });

    return {
      product: this.normalizeProduct(result.product),
      transaction: result.transaction,
      log: this.normalizeLog({
        ...result.log,
        product: result.product,
        user: {
          id: actor.userId,
          email: actor.email,
          role: actor.role
        } as never
      } as InventoryLog)
    };
  }

  async listHistory(query: Record<string, unknown> = {}) {
    const productId = query.productId !== undefined && query.productId !== null && query.productId !== ''
      ? this.parseId(query.productId, 'product id')
      : null;
    const limit = query.limit === undefined ? 50 : this.parseInteger(query.limit, 'limit');
    const offset = query.offset === undefined ? 0 : this.parseInteger(query.offset, 'offset');

    const transactions = await this.inventoryRepository.findTransactions({
      productId,
      limit,
      offset
    });

    return transactions;
  }

  async listLowStockAlerts() {
    const products = await this.inventoryRepository.findLowStockProducts();
    return products.map((product) => this.normalizeProduct(product));
  }

  async listLogs(query: Record<string, unknown> = {}) {
    const productId = query.productId !== undefined && query.productId !== null && query.productId !== ''
      ? this.parseId(query.productId, 'product id')
      : null;
    const userId = query.userId !== undefined && query.userId !== null && query.userId !== ''
      ? this.parseId(query.userId, 'user id')
      : null;
    const actionType = query.actionType ? this.normalizeActionType(query.actionType) : null;
    const limit = query.limit === undefined ? 50 : this.parseInteger(query.limit, 'limit');
    const offset = query.offset === undefined ? 0 : this.parseInteger(query.offset, 'offset');

    const logs = await this.inventoryRepository.findLogs({
      productId,
      userId,
      actionType,
      limit,
      offset
    });

    return logs.map((log) => this.normalizeLog(log));
  }
}
