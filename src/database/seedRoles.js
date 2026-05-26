const { AppDataSource } = require('./data-source');
const { Roles } = require('../constants/roles');
const { RoleSchema } = require('../modules/auth/models/Role');

const defaultRoles = [
  {
    name: Roles.ADMIN,
    description: 'Administrator'
  },
  {
    name: Roles.EMPLOYEE,
    description: 'Employee'
  }
];

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
