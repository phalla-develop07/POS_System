const { AppDataSource } = require('../../../database/data-source');
const { SaleItemSchema } = require('../models/SaleItem');

class SaleItemRepository {
  constructor() {
    this.repository = AppDataSource.getRepository(SaleItemSchema);
  }

  findBestSellingProductsByMonth(year, month, limit = 10) {
    return this.repository
      .createQueryBuilder('item')
      .innerJoin('item.sale', 'sale')
      .leftJoin('item.product', 'product')
      .select('product.id', 'productId')
      .addSelect('product.sku', 'sku')
      .addSelect('product.name', 'name')
      .addSelect('SUM(item.quantity)', 'totalQuantity')
      .addSelect('SUM(item.lineTotal)', 'totalRevenue')
      .addSelect('COUNT(DISTINCT sale.id)', 'saleCount')
      .where('sale.status = :status', { status: 'COMPLETED' })
      .andWhere('YEAR(COALESCE(sale.completedAt, sale.createdAt)) = :year', { year })
      .andWhere('MONTH(COALESCE(sale.completedAt, sale.createdAt)) = :month', { month })
      .groupBy('product.id')
      .addGroupBy('product.sku')
      .addGroupBy('product.name')
      .orderBy('totalQuantity', 'DESC')
      .addOrderBy('totalRevenue', 'DESC')
      .limit(limit)
      .getRawMany();
  }
}

module.exports.SaleItemRepository = SaleItemRepository;
