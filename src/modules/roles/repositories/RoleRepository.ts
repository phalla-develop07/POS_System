import { BaseRepository } from '../../../core/base/BaseRepository';
import { RoleSchema, type Role } from '../models/Role';

export class RoleRepository extends BaseRepository<Role> {
  constructor() {
    super(RoleSchema);
  }

  findByName(name: string) {
    return this.repository.findOne({ where: { name } });
  }

  async updateById(id: number, data: Partial<Role>) {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async deleteById(id: number) {
    const role = await this.findById(id);

    if (!role) {
      return null;
    }

    await this.repository.delete(id);
    return role;
  }
}
