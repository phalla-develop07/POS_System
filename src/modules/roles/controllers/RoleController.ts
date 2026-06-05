import type { NextFunction, Request, Response } from 'express';
import { successResponse } from '../../../core/utils/response';
import { RoleService } from '../services/RoleService';

export class RoleController {
  roleService: RoleService;

  constructor(roleService = new RoleService()) {
    this.roleService = roleService;
  }

  async getDefaults(_req: Request, res: Response, next: NextFunction) {
    try {
      return successResponse(res, this.roleService.getDefaultRoles(), 'Default roles retrieved');
    } catch (error) {
      return next(error);
    }
  }

  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const roles = await this.roleService.findAll();
      return successResponse(res, roles, 'Roles retrieved');
    } catch (error) {
      return next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const role = await this.roleService.findById(id);
      return successResponse(res, role, 'Role retrieved');
    } catch (error) {
      return next(error);
    }
  }

  async getPermissions(req: Request, res: Response, next: NextFunction) {
    try {
      const name = Array.isArray(req.params.name) ? req.params.name[0] : req.params.name;
      const result = await this.roleService.findPermissions(name);
      return successResponse(res, result, 'Role permissions retrieved');
    } catch (error) {
      return next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const role = await this.roleService.create(req.body);
      return successResponse(res, role, 'Role created', 201);
    } catch (error) {
      return next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const role = await this.roleService.update(id, req.body);
      return successResponse(res, role, 'Role updated');
    } catch (error) {
      return next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const role = await this.roleService.delete(id);
      return successResponse(res, role, 'Role deleted');
    } catch (error) {
      return next(error);
    }
  }

  async seedDefaults(_req: Request, res: Response, next: NextFunction) {
    try {
      const insertedCount = await this.roleService.seedDefaults();
      return successResponse(res, { insertedCount }, 'Default roles seeded');
    } catch (error) {
      return next(error);
    }
  }
}
