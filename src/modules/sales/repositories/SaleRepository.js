const { AppDataSource } = require('../../../database/data-source');
const { SaleSchema } = require('../models/Sale');

class SaleRepository {
  constructor() {
    this.repository = AppDataSource.getRepository(SaleSchema);
  }

  findCompletedSalesByMonth(year, month) {
    return this.repository
      .createQueryBuilder('sale')
      .leftJoinAndSelect('sale.user', 'user')
      .where('YEAR(sale.createdAt) = :year', { year })
      .andWhere('MONTH(sale.createdAt) = :month', { month })
      .andWhere('sale.status = :status', { status: 'COMPLETED' })
      .orderBy('sale.createdAt', 'ASC')
      .getMany();
  }
}

module.exports.SaleRepository = SaleRepository;
