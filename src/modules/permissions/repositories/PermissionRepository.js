const { BaseRepository } = require('../../../core/base/BaseRepository');
const { PermissionSchema } = require('../models/Permission');

class PermissionRepository extends BaseRepository {
  constructor() {
    super(PermissionSchema);
  }

  findByName(name) {
    return this.repository.findOne({ where: { name } });
  }

  findBySlug(slug) {
    return this.repository.findOne({ where: { slug } });
  }

  findByNameOrSlug(value) {
    return this.repository.findOne({
      where: [
        { name: value },
        { slug: value }
      ]
    });
  }

  async updateById(id, data) {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async deleteById(id) {
    const permission = await this.findById(id);

    if (!permission) {
      return null;
    }

    await this.repository.delete(id);
    return permission;
  }
}

module.exports.PermissionRepository = PermissionRepository;
