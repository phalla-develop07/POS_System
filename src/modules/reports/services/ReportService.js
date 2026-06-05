const { AppError } = require('../../../core/errors/AppError');
const { SaleRepository } = require('../../sales/repositories/SaleRepository');
const { SaleItemRepository } = require('../../sales/repositories/SaleItemRepository');

class ReportService {
  constructor(saleRepository = new SaleRepository(), saleItemRepository = new SaleItemRepository()) {
    this.saleRepository = saleRepository;
    this.saleItemRepository = saleItemRepository;
  }

  parseMonth(value) {
    if (value === undefined || value === null || value === '') {
      const now = new Date();
      return {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        monthKey: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
      };
    }

    const normalized = String(value).trim();

    if (!/^\d{4}-\d{2}$/.test(normalized)) {
      throw new AppError('month must be in YYYY-MM format', 400);
    }

    const [yearPart, monthPart] = normalized.split('-');
    const year = Number(yearPart);
    const month = Number(monthPart);

    if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
      throw new AppError('month must be in YYYY-MM format', 400);
    }

    return {
      year,
      month,
      monthKey: normalized
    };
  }

  toNumber(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  getDayKey(dateValue) {
    const date = new Date(dateValue);
    return date.toISOString().slice(0, 10);
  }

  async getMonthlyRevenueReport(query = {}) {
    const { year, month, monthKey } = this.parseMonth(query.month);
    const sales = await this.saleRepository.findCompletedSalesByMonth(year, month);

    const summary = {
      totalSales: sales.length,
      totalRevenue: 0,
      averageSaleValue: 0,
      highestSaleValue: 0,
      lowestSaleValue: 0,
      cashRevenue: 0,
      cardRevenue: 0,
      mobileRevenue: 0,
      otherRevenue: 0
    };

    const dailyMap = new Map();

    for (const sale of sales) {
      const amount = this.toNumber(sale.totalAmount);
      summary.totalRevenue += amount;
      summary.highestSaleValue = Math.max(summary.highestSaleValue, amount);
      summary.lowestSaleValue = summary.lowestSaleValue === 0 ? amount : Math.min(summary.lowestSaleValue, amount);

      switch (sale.paymentMethod) {
        case 'CASH':
          summary.cashRevenue += amount;
          break;
        case 'CARD':
          summary.cardRevenue += amount;
          break;
        case 'MOBILE':
          summary.mobileRevenue += amount;
          break;
        default:
          summary.otherRevenue += amount;
          break;
      }

      const dayKey = this.getDayKey(sale.completedAt || sale.createdAt);
      const existing = dailyMap.get(dayKey) || {
        date: dayKey,
        salesCount: 0,
        revenue: 0
      };

      existing.salesCount += 1;
      existing.revenue += amount;
      dailyMap.set(dayKey, existing);
    }

    if (summary.totalSales > 0) {
      summary.averageSaleValue = summary.totalRevenue / summary.totalSales;
    }

    const dailyBreakdown = Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date));

    return {
      month: monthKey,
      summary,
      dailyBreakdown,
      sales: sales.map((sale) => ({
        id: sale.id,
        invoiceNo: sale.invoiceNo,
        totalAmount: this.toNumber(sale.totalAmount),
        paymentMethod: sale.paymentMethod,
        status: sale.status,
        note: sale.note,
        createdAt: sale.createdAt,
        completedAt: sale.completedAt,
        user: sale.user
          ? {
              id: sale.user.id,
              email: sale.user.email,
              role: sale.user.role
            }
          : null
      }))
    };
  }

  async getBestSellingProductsReport(query = {}) {
    const { year, month, monthKey } = this.parseMonth(query.month);
    const limitValue = query.limit === undefined || query.limit === null || query.limit === ''
      ? 10
      : Number(query.limit);

    if (!Number.isInteger(limitValue) || limitValue <= 0) {
      throw new AppError('limit must be a positive integer', 400);
    }

    const products = await this.saleItemRepository.findBestSellingProductsByMonth(year, month, limitValue);

    const summary = products.reduce((acc, item) => {
      const quantity = this.toNumber(item.totalQuantity);
      const revenue = this.toNumber(item.totalRevenue);

      acc.totalQuantity += quantity;
      acc.totalRevenue += revenue;

      if (acc.topProduct === null) {
        acc.topProduct = {
          productId: this.toNumber(item.productId),
          sku: item.sku,
          name: item.name,
          totalQuantity: quantity,
          totalRevenue: revenue,
          saleCount: this.toNumber(item.saleCount)
        };
      }

      return acc;
    }, {
      totalQuantity: 0,
      totalRevenue: 0,
      topProduct: null
    });

    return {
      month: monthKey,
      summary: {
        totalProducts: products.length,
        totalQuantitySold: summary.totalQuantity,
        totalRevenue: summary.totalRevenue,
        topProduct: summary.topProduct
      },
      products: products.map((item, index) => ({
        rank: index + 1,
        productId: this.toNumber(item.productId),
        sku: item.sku,
        name: item.name,
        totalQuantity: this.toNumber(item.totalQuantity),
        totalRevenue: this.toNumber(item.totalRevenue),
        saleCount: this.toNumber(item.saleCount)
      }))
    };
  }

  async getEmployeePerformanceReport(query = {}) {
    const { year, month, monthKey } = this.parseMonth(query.month);
    const limitValue = query.limit === undefined || query.limit === null || query.limit === ''
      ? 10
      : Number(query.limit);

    if (!Number.isInteger(limitValue) || limitValue <= 0) {
      throw new AppError('limit must be a positive integer', 400);
    }

    const sales = await this.saleRepository.findCompletedSalesByMonth(year, month);
    const employeeMap = new Map();

    for (const sale of sales) {
      const employee = sale.user || {};
      const userId = employee.id;

      if (!userId) {
        continue;
      }

      const amount = this.toNumber(sale.totalAmount);
      const saleDate = sale.completedAt || sale.createdAt;
      const existing = employeeMap.get(userId) || {
        userId,
        email: employee.email || null,
        role: employee.role || null,
        name: employee.email || `User ${userId}`,
        salesCount: 0,
        totalRevenue: 0,
        averageSaleValue: 0,
        highestSaleValue: 0,
        lowestSaleValue: 0,
        firstSaleAt: saleDate,
        lastSaleAt: saleDate
      };

      existing.salesCount += 1;
      existing.totalRevenue += amount;
      existing.highestSaleValue = Math.max(existing.highestSaleValue, amount);
      existing.lowestSaleValue = existing.lowestSaleValue === 0 ? amount : Math.min(existing.lowestSaleValue, amount);
      existing.firstSaleAt = new Date(existing.firstSaleAt) < new Date(saleDate) ? existing.firstSaleAt : saleDate;
      existing.lastSaleAt = new Date(existing.lastSaleAt) > new Date(saleDate) ? existing.lastSaleAt : saleDate;
      existing.averageSaleValue = existing.totalRevenue / existing.salesCount;

      employeeMap.set(userId, existing);
    }

    const employees = Array.from(employeeMap.values())
      .sort((a, b) => {
        if (b.totalRevenue !== a.totalRevenue) {
          return b.totalRevenue - a.totalRevenue;
        }

        return b.salesCount - a.salesCount;
      })
      .slice(0, limitValue)
      .map((employee, index) => ({
        rank: index + 1,
        userId: employee.userId,
        email: employee.email,
        role: employee.role,
        name: employee.name,
        salesCount: employee.salesCount,
        totalRevenue: employee.totalRevenue,
        averageSaleValue: employee.averageSaleValue,
        highestSaleValue: employee.highestSaleValue,
        lowestSaleValue: employee.lowestSaleValue,
        firstSaleAt: employee.firstSaleAt,
        lastSaleAt: employee.lastSaleAt
      }));

    const summary = employees.reduce((acc, employee) => {
      acc.totalSalesCount += employee.salesCount;
      acc.totalRevenue += employee.totalRevenue;
      acc.totalEmployees += 1;
      return acc;
    }, {
      totalEmployees: 0,
      totalSalesCount: 0,
      totalRevenue: 0
    });

    return {
      month: monthKey,
      summary: {
        totalEmployees: summary.totalEmployees,
        totalSalesCount: summary.totalSalesCount,
        totalRevenue: summary.totalRevenue,
        averageRevenuePerEmployee: summary.totalEmployees > 0 ? summary.totalRevenue / summary.totalEmployees : 0,
        topEmployee: employees.length > 0 ? employees[0] : null
      },
      employees
    };
  }
}

module.exports.ReportService = ReportService;
