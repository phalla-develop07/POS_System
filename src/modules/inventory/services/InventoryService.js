const { AppError } = require('../../../core/errors/AppError');
const { AppDataSource } = require('../../../database/data-source');
const { InventoryRepository } = require('../repositories/InventoryRepository');
const { ProductSchema } = require('../models/Product');
const { InventoryTransactionSchema } = require('../models/InventoryTransaction');
const { InventoryLogSchema } = require('../models/InventoryLog');

class InventoryService {
  constructor(inventoryRepository = new InventoryRepository()) {
    this.inventoryRepository = inventoryRepository;
  }

  normalizeProduct(product) {
    return {
      ...product,
      stockStatus: product.currentStock <= product.lowStockThreshold ? 'LOW_STOCK' : 'IN_STOCK',
      isLowStock: product.currentStock <= product.lowStockThreshold
    };
  }

  parseId(id, label = 'id') {
    const parsedId = Number(id);

    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      throw new AppError(`Invalid ${label}`, 400);
    }

    return parsedId;
  }

  parseInteger(value, label, { allowZero = true } = {}) {
    const parsedValue = Number(value);

    if (!Number.isInteger(parsedValue) || parsedValue < 0 || (!allowZero && parsedValue === 0)) {
      throw new AppError(`Invalid ${label}`, 400);
    }

    return parsedValue;
  }

  normalizeString(value) {
    if (typeof value !== 'string') {
      return '';
    }

    return value.trim();
  }

  normalizeActionType(value) {
    return this.normalizeString(value).toUpperCase();
  }

  normalizeUser(user) {
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

  normalizeLog(log) {
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

  parseDate(value, label = 'date') {
    const normalized = this.normalizeString(value);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
      throw new AppError(`Invalid ${label}`, 400);
    }

    const date = new Date(`${normalized}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      throw new AppError(`Invalid ${label}`, 400);
    }

    return normalized;
  }

  async listProducts() {
    const products = await this.inventoryRepository.findAllProducts();
    return products.map((product) => this.normalizeProduct(product));
  }

  async getProductById(id) {
    const productId = this.parseId(id, 'product id');
    const product = await this.inventoryRepository.findProductById(productId);

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return this.normalizeProduct(product);
  }

  async createProduct(payload, actorUser) {
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
          currentStock: initialStock,
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
          user: { id: actor.userId },
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

  async updateProduct(id, payload, actorUser) {
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
        product.isActive = payload.isActive;
      }

      const savedProduct = await productRepository.save(product);

      await logRepository.save(
        logRepository.create({
          product: savedProduct,
          user: { id: actor.userId },
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

  async adjustStock(id, payload, actorUser) {
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

      const previousStock = product.currentStock;
      const newStock = movementType === 'IN'
        ? previousStock + quantity
        : previousStock - quantity;

      if (newStock < 0) {
        throw new AppError('Insufficient stock for this update', 400);
      }

      product.currentStock = newStock;
      const savedProduct = await productRepository.save(product);

      const transaction = await transactionRepository.save(
        transactionRepository.create({
          product: savedProduct,
          movementType,
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
          user: { id: actor.userId },
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
        }
      })
    };
  }

  async listHistory(query = {}) {
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

  async listLogs(query = {}) {
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

  async getDailyReport(query = {}) {
    const reportDate = query.date ? this.parseDate(query.date, 'report date') : this.parseDate(new Date().toISOString().slice(0, 10), 'report date');

    const [transactions, logs, products, lowStockProducts] = await Promise.all([
      this.inventoryRepository.findTransactionsByDate(reportDate),
      this.inventoryRepository.findLogsByDate(reportDate),
      this.inventoryRepository.findAllProducts(),
      this.inventoryRepository.findLowStockProducts()
    ]);

    const summary = {
      stockInCount: 0,
      stockOutCount: 0,
      stockInQuantity: 0,
      stockOutQuantity: 0,
      createProductCount: 0,
      updateProductCount: 0,
      otherActionCount: 0
    };

    for (const transaction of transactions) {
      if (transaction.movementType === 'IN') {
        summary.stockInCount += 1;
        summary.stockInQuantity += transaction.quantity;
      }

      if (transaction.movementType === 'OUT') {
        summary.stockOutCount += 1;
        summary.stockOutQuantity += transaction.quantity;
      }
    }

    for (const log of logs) {
      if (log.actionType === 'CREATE_PRODUCT') {
        summary.createProductCount += 1;
      } else if (log.actionType === 'UPDATE_PRODUCT') {
        summary.updateProductCount += 1;
      } else {
        summary.otherActionCount += 1;
      }
    }

    return {
      reportDate,
      summary: {
        totalProducts: products.length,
        activeProducts: products.filter((product) => product.isActive).length,
        lowStockProducts: lowStockProducts.length,
        inventoryActions: logs.length,
        stockMovements: transactions.length,
        ...summary
      },
      lowStockItems: lowStockProducts.map((product) => this.normalizeProduct(product)),
      transactions: transactions.map((transaction) => ({
        id: transaction.id,
        movementType: transaction.movementType,
        quantity: transaction.quantity,
        previousStock: transaction.previousStock,
        newStock: transaction.newStock,
        reason: transaction.reason,
        reference: transaction.reference,
        createdAt: transaction.createdAt,
        product: transaction.product
          ? {
              id: transaction.product.id,
              sku: transaction.product.sku,
              name: transaction.product.name
            }
          : null
      })),
      logs: logs.map((log) => this.normalizeLog(log))
    };
  }
}

module.exports.InventoryService = InventoryService;
