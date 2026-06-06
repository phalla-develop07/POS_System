import type { NextFunction, Request, Response } from 'express';
import { successResponse } from '../../../core/utils/response';
import { PermissionService } from '../services/PermissionService';

export class PermissionController {
  permissionService: PermissionService;

  constructor(permissionService = new PermissionService()) {
    this.permissionService = permissionService;
  }

  async getDefaults(_req: Request, res: Response, next: NextFunction) {
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

  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const permissions = await this.permissionService.findAll();
      return successResponse(res, permissions, 'Permissions retrieved');
    } catch (error) {
      return next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const permission = await this.permissionService.findById(id);
      return successResponse(res, permission, 'Permission retrieved');
    } catch (error) {
      return next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const permission = await this.permissionService.create(req.body);
      return successResponse(res, permission, 'Permission created', 201);
    } catch (error) {
      return next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const permission = await this.permissionService.update(id, req.body);
      return successResponse(res, permission, 'Permission updated');
    } catch (error) {
      return next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const permission = await this.permissionService.delete(id);
      return successResponse(res, permission, 'Permission deleted');
    } catch (error) {
      return next(error);
    }
  }

  async seedDefaults(_req: Request, res: Response, next: NextFunction) {
    try {
      const insertedCount = await this.permissionService.seedDefaults();
      return successResponse(res, { insertedCount }, 'Default permissions seeded');
    } catch (error) {
      return next(error);
    }
  }
}
