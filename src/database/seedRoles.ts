import { AppDataSource } from './data-source';
import { RoleDescriptions, RoleList } from '../constants/roles';
import { RoleSchema } from '../modules/auth/models/Role';

const defaultRoles = RoleList.map((name) => ({
  name,
  description: RoleDescriptions[name] || null
}));

export async function seedRoles() {
  const roleRepository = AppDataSource.getRepository(RoleSchema);
  let insertedCount = 0;

  for (const role of defaultRoles) {
    const existingRole = await roleRepository.findOne({ where: { name: role.name } });

    if (!existingRole) {
      await roleRepository.save(role);
      insertedCount += 1;
    }
  }

  return insertedCount;
}
