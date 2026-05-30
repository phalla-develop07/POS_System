const { BaseRepository } = require('../../../core/base/BaseRepository');
const { RoleSchema } = require('../models/Role');

class RoleRepository extends BaseRepository {
  constructor() {
    super(RoleSchema);
  }

  findByName(name) {
    return this.repository.findOne({ where: { name } });
  }

  async updateById(id, data) {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async deleteById(id) {
    const role = await this.findById(id);

    if (!role) {
      return null;
    }

    await this.repository.delete(id);
    return role;
  }
}

module.exports.RoleRepository = RoleRepository;
