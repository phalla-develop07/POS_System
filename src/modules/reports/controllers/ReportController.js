const { successResponse } = require('../../../core/utils/response');
const { ReportService } = require('../services/ReportService');

class ReportController {
  constructor(reportService = new ReportService()) {
    this.reportService = reportService;
  }

  async monthlyRevenue(req, res, next) {
    try {
      const report = await this.reportService.getMonthlyRevenueReport(req.query || {});
      return successResponse(res, report, 'Monthly revenue report retrieved');
    } catch (error) {
      return next(error);
    }
  }

  async bestSellingProducts(req, res, next) {
    try {
      const report = await this.reportService.getBestSellingProductsReport(req.query || {});
      return successResponse(res, report, 'Best selling products report retrieved');
    } catch (error) {
      return next(error);
    }
  }

  async employeePerformance(req, res, next) {
    try {
      const report = await this.reportService.getEmployeePerformanceReport(req.query || {});
      return successResponse(res, report, 'Employee performance report retrieved');
    } catch (error) {
      return next(error);
    }
  }
}

module.exports.ReportController = ReportController;
