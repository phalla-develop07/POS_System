const { AppError } = require('../../../core/errors/AppError');
const { RoleDescriptions, RoleList, Roles } = require('../../../constants/roles');
const { RolePermissions } = require('../../../constants/permissions');
const { RoleRepository } = require('../repositories/RoleRepository');

class RoleService {
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

  async findById(id) {
    const role = await this.roleRepository.findById(Number(id));

    if (!role) {
      throw new AppError('Role not found', 404);
    }

    return role;
  }

  async findPermissions(roleName) {
    const name = String(roleName || '').trim().toUpperCase();

    if (!RoleList.includes(name)) {
      throw new AppError('Invalid role name', 400);
    }

    return {
      role: name,
      permissions: RolePermissions[name] || []
    };
  }

  async create(data) {
    const payload = this.normalizePayload(data, true);
    const existingRole = await this.roleRepository.findByName(payload.name);

    if (existingRole) {
      throw new AppError('Role already exists', 409);
    }

    return this.roleRepository.save(payload);
  }

  async update(id, data) {
    const roleId = Number(id);
    await this.findById(roleId);

    const payload = this.normalizePayload(data, false);

    if (payload.name) {
      const existingRole = await this.roleRepository.findByName(payload.name);

      if (existingRole && existingRole.id !== roleId) {
        throw new AppError('Role already exists', 409);
      }
    }

    return this.roleRepository.updateById(roleId, payload);
  }

  async delete(id) {
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
          description: role.description
        });
        insertedCount += 1;
      }
    }

    return insertedCount;
  }

  normalizePayload(data, requireName) {
    const payload = {};

    if (data.name !== undefined) {
      payload.name = String(data.name).trim().toUpperCase();
    }

    if (requireName && !payload.name) {
      throw new AppError('Role name is required', 400);
    }

    if (payload.name && !Object.values(Roles).includes(payload.name)) {
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

module.exports.RoleService = RoleService;
