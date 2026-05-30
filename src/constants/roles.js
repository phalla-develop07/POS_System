module.exports.Roles = {
  ADMIN: 'ADMIN',
  EMPLOYEE: 'EMPLOYEE'
};

module.exports.RoleDescriptions = {
  [module.exports.Roles.ADMIN]: 'Administrator with full system access',
  [module.exports.Roles.EMPLOYEE]: 'Employee with basic POS access'
};

module.exports.RoleList = Object.values(module.exports.Roles);
