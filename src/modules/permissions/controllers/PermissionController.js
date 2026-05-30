const { successResponse } = require('../../../core/utils/response');
const { PermissionService } = require('../services/PermissionService');

class PermissionController {
  constructor(permissionService = new PermissionService()) {
    this.permissionService = permissionService;
  }

  async getDefaults(_req, res, next) {
    try {
      return successResponse(
        res,
        this.permissionService.getDefaultPermissions(),
        'Default permissions retrieved'
      );
    } catch (error) {
      return next(error);
    }
  }

  async getAll(_req, res, next) {
    try {
      const permissions = await this.permissionService.findAll();
      return successResponse(res, permissions, 'Permissions retrieved');
    } catch (error) {
      return next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const permission = await this.permissionService.findById(req.params.id);
      return successResponse(res, permission, 'Permission retrieved');
    } catch (error) {
      return next(error);
    }
  }

  async create(req, res, next) {
    try {
      const permission = await this.permissionService.create(req.body);
      return successResponse(res, permission, 'Permission created', 201);
    } catch (error) {
      return next(error);
    }
  }

  async update(req, res, next) {
    try {
      const permission = await this.permissionService.update(req.params.id, req.body);
      return successResponse(res, permission, 'Permission updated');
    } catch (error) {
      return next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const permission = await this.permissionService.delete(req.params.id);
      return successResponse(res, permission, 'Permission deleted');
    } catch (error) {
      return next(error);
    }
  }

  async seedDefaults(_req, res, next) {
    try {
      const insertedCount = await this.permissionService.seedDefaults();
      return successResponse(res, { insertedCount }, 'Default permissions seeded');
    } catch (error) {
      return next(error);
    }
  }
}

module.exports.PermissionController = PermissionController;
