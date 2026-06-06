import { AppError } from '../../../core/errors/AppError';
import { RoleDescriptions, RoleList, Roles } from '../../../constants/roles';
import { RolePermissions } from '../../../constants/permissions';
import { RoleRepository } from '../repositories/RoleRepository';
import type { Role } from '../models/Role';

export class RoleService {
  roleRepository: RoleRepository;

  constructor(roleRepository = new RoleRepository()) {
    this.roleRepository = roleRepository;
  }

  getDefaultRoles() {
    return RoleList.map((name) => ({
      name,
      description: RoleDescriptions[name] || null,
      permissions: RolePermissions[name] || []
    }));
  }

  findAll() {
    return this.roleRepository.findAll();
  }

  async findById(id: string | number) {
    const role = await this.roleRepository.findById(Number(id));

    if (!role) {
      throw new AppError('Role not found', 404);
    }

    return role;
  }

  async findPermissions(roleName: string) {
    const name = String(roleName || '').trim().toUpperCase();

    if (!RoleList.includes(name as (typeof RoleList)[number])) {
      throw new AppError('Invalid role name', 400);
    }

    return {
      role: name,
      permissions: RolePermissions[name] || []
    };
  }

  async create(data: Record<string, unknown>) {
    const payload = this.normalizePayload(data, true);
    const existingRole = await this.roleRepository.findByName(payload.name as string);

    if (existingRole) {
      throw new AppError('Role already exists', 409);
    }

    return this.roleRepository.save(payload);
  }

  async update(id: string | number, data: Record<string, unknown>) {
    const roleId = Number(id);
    await this.findById(roleId);

    const payload = this.normalizePayload(data, false);

    if (payload.name) {
      const existingRole = await this.roleRepository.findByName(payload.name);

      if (existingRole && existingRole.id !== roleId) {
        throw new AppError('Role already exists', 409);
      }
    }

    return this.roleRepository.updateById(roleId, payload as Partial<Role>);
  }

  async delete(id: string | number) {
    const deletedRole = await this.roleRepository.deleteById(Number(id));

    if (!deletedRole) {
      throw new AppError('Role not found', 404);
    }

    return deletedRole;
  }

  async seedDefaults() {
    let insertedCount = 0;

    for (const role of this.getDefaultRoles()) {
      const existingRole = await this.roleRepository.findByName(role.name);

      if (!existingRole) {
        await this.roleRepository.save({
          name: role.name,
          description: role.description || null
        });
        insertedCount += 1;
      }
    }

    return insertedCount;
  }

  normalizePayload(data: Record<string, unknown>, requireName: boolean) {
    const payload: Partial<Role> = {};

    if (data.name !== undefined) {
      payload.name = String(data.name).trim().toUpperCase();
    }

    if (requireName && !payload.name) {
      throw new AppError('Role name is required', 400);
    }

    if (payload.name && !Object.values(Roles).includes(payload.name as (typeof RoleList)[number])) {
      throw new AppError('Invalid role name', 400);
    }

    if (data.description !== undefined) {
      const description = String(data.description).trim();
      payload.description = description || null;
    }

    if (!requireName && Object.keys(payload).length === 0) {
      throw new AppError('No role data provided', 400);
    }

    return payload;
  }
}
