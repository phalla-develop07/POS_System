import { BaseRepository } from '../../../core/base/BaseRepository';
import { PermissionSchema, type Permission } from '../models/Permission';

export class PermissionRepository extends BaseRepository<Permission> {
  constructor() {
    super(PermissionSchema);
  }

  findByName(name: string) {
    return this.repository.findOne({ where: { name } });
  }

  findBySlug(slug: string) {
    return this.repository.findOne({ where: { slug } });
  }

  findByNameOrSlug(value: string) {
    return this.repository.findOne({
      where: [
        { name: value },
        { slug: value }
      ]
    });
  }

  async updateById(id: number, data: Partial<Permission>) {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async deleteById(id: number) {
    const permission = await this.findById(id);

    if (!permission) {
      return null;
    }

    await this.repository.delete(id);
    return permission;
  }
}
