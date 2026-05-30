const { AppDataSource } = require('./data-source');
const { RoleDescriptions, RoleList } = require('../constants/roles');
const { RoleSchema } = require('../modules/auth/models/Role');

const defaultRoles = RoleList.map((name) => ({
  name,
  description: RoleDescriptions[name] || null
}));

async function seedRoles() {
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

module.exports.seedRoles = seedRoles;
