const { successResponse } = require('../../../core/utils/response');
const { RoleService } = require('../services/RoleService');

class RoleController {
  constructor(roleService = new RoleService()) {
    this.roleService = roleService;
  }

  async getDefaults(_req, res, next) {
    try {
      return successResponse(res, this.roleService.getDefaultRoles(), 'Default roles retrieved');
    } catch (error) {
      return next(error);
    }
  }

  async getAll(_req, res, next) {
    try {
      const roles = await this.roleService.findAll();
      return successResponse(res, roles, 'Roles retrieved');
    } catch (error) {
      return next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const role = await this.roleService.findById(req.params.id);
      return successResponse(res, role, 'Role retrieved');
    } catch (error) {
      return next(error);
    }
  }

  async getPermissions(req, res, next) {
    try {
      const result = await this.roleService.findPermissions(req.params.name);
      return successResponse(res, result, 'Role permissions retrieved');
    } catch (error) {
      return next(error);
    }
  }

  async create(req, res, next) {
    try {
      const role = await this.roleService.create(req.body);
      return successResponse(res, role, 'Role created', 201);
    } catch (error) {
      return next(error);
    }
  }

  async update(req, res, next) {
    try {
      const role = await this.roleService.update(req.params.id, req.body);
      return successResponse(res, role, 'Role updated');
    } catch (error) {
      return next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const role = await this.roleService.delete(req.params.id);
      return successResponse(res, role, 'Role deleted');
    } catch (error) {
      return next(error);
    }
  }

  async seedDefaults(_req, res, next) {
    try {
      const insertedCount = await this.roleService.seedDefaults();
      return successResponse(res, { insertedCount }, 'Default roles seeded');
    } catch (error) {
      return next(error);
    }
  }
}

module.exports.RoleController = RoleController;
