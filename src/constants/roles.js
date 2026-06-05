module.exports.Roles = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  CASHIER: 'CASHIER',
  EMPLOYEE: 'EMPLOYEE'
};

module.exports.RoleDescriptions = {
  [module.exports.Roles.ADMIN]: 'Administrator with full system access',
  [module.exports.Roles.MANAGER]: 'Manager with product, sales, order, employee, and inventory access',
  [module.exports.Roles.CASHIER]: 'Cashier with sales and order access',
  [module.exports.Roles.EMPLOYEE]: 'Employee with basic POS access'
};

module.exports.RoleList = Object.values(module.exports.Roles);
