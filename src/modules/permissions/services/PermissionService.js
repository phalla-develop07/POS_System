const { AppError } = require('../../../core/errors/AppError');
const {
  getDefaultPermissionPayloads,
  getPermissionModule,
  getPermissionName,
  PermissionList,
  Permissions
} = require('../../../constants/permissions');
const { PermissionRepository } = require('../repositories/PermissionRepository');

class PermissionService {
  constructor(permissionRepository = new PermissionRepository()) {
    this.permissionRepository = permissionRepository;
  }

  getDefaultPermissions() {
    return getDefaultPermissionPayloads();
  }

  findAll() {
    return this.permissionRepository.findAll();
  }

  async findById(id) {
    const permission = await this.permissionRepository.findById(Number(id));

    if (!permission) {
      throw new AppError('Permission not found', 404);
    }

    return permission;
  }

  async create(data) {
    const payload = this.normalizePayload(data, true);
    const existingPermission = await this.permissionRepository.findBySlug(payload.slug);

    if (existingPermission) {
      throw new AppError('Permission already exists', 409);
    }

    return this.permissionRepository.save(payload);
  }

  async update(id, data) {
    const permissionId = Number(id);
    await this.findById(permissionId);

    const payload = this.normalizePayload(data, false);

    if (payload.slug) {
      const slug = payload.slug;
      const existingPermission = await this.permissionRepository.findBySlug(slug);

      if (existingPermission && String(existingPermission.id) !== String(permissionId)) {
        throw new AppError('Permission already exists', 409);
      }
    }

    return this.permissionRepository.updateById(permissionId, payload);
  }

  async delete(id) {
    const deletedPermission = await this.permissionRepository.deleteById(Number(id));

    if (!deletedPermission) {
      throw new AppError('Permission not found', 404);
    }

    return deletedPermission;
  }

  async seedDefaults() {
    let insertedCount = 0;

    for (const permission of this.getDefaultPermissions()) {
      const existingPermission = await this.permissionRepository.findByNameOrSlug(permission.slug);

      if (!existingPermission) {
        await this.permissionRepository.save(permission);
        insertedCount += 1;
      } else if (
        existingPermission.name !== permission.name ||
        existingPermission.slug !== permission.slug ||
        existingPermission.module !== permission.module
      ) {
        await this.permissionRepository.updateById(existingPermission.id, permission);
      }
    }

    return insertedCount;
  }

  normalizePayload(data, requireName) {
    const payload = {};

    if (data.slug !== undefined) {
      payload.slug = this.normalizeSlug(data.slug);
    }

    if (data.name !== undefined) {
      const name = String(data.name).trim();

      if (!payload.slug && this.isPermissionSlug(name)) {
        payload.slug = this.normalizeSlug(name);
      }

      payload.name = payload.slug && name === payload.slug ? getPermissionName(payload.slug) : name;
    }

    if (requireName && !payload.slug) {
      throw new AppError('Permission slug is required', 400);
    }

    if (payload.slug && !this.isPermissionSlug(payload.slug)) {
      throw new AppError('Invalid permission slug', 400);
    }

    if (!payload.name && payload.slug) {
      payload.name = getPermissionName(payload.slug);
    }

    if (requireName && !payload.name) {
      throw new AppError('Permission name is required', 400);
    }

    if (data.module !== undefined) {
      payload.module = String(data.module).trim().toLowerCase();
    }

    if (!payload.module && payload.slug) {
      payload.module = getPermissionModule(payload.slug);
    }

    if (!requireName && Object.keys(payload).length === 0) {
      throw new AppError('No permission data provided', 400);
    }

    return payload;
  }

  normalizeSlug(value) {
    return String(value).trim().toUpperCase();
  }

  isPermissionSlug(value) {
    return Object.values(Permissions).includes(this.normalizeSlug(value));
  }
}

module.exports.PermissionService = PermissionService;
