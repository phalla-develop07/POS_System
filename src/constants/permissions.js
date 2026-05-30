module.exports.Permissions = {
  MANAGE_PRODUCTS: 'MANAGE_PRODUCTS',
  VIEW_PRODUCTS: 'VIEW_PRODUCTS',
  CREATE_PRODUCTS: 'CREATE_PRODUCTS',
  UPDATE_PRODUCTS: 'UPDATE_PRODUCTS',
  DELETE_PRODUCTS: 'DELETE_PRODUCTS',
  MANAGE_SALES: 'MANAGE_SALES',
  VIEW_SALES: 'VIEW_SALES',
  CREATE_SALES: 'CREATE_SALES',
  UPDATE_SALES: 'UPDATE_SALES',
  DELETE_SALES: 'DELETE_SALES',
  VIEW_REPORTS: 'VIEW_REPORTS',
  MANAGE_ROLES: 'MANAGE_ROLES',
  VIEW_ROLES: 'VIEW_ROLES',
  CREATE_ROLES: 'CREATE_ROLES',
  UPDATE_ROLES: 'UPDATE_ROLES',
  DELETE_ROLES: 'DELETE_ROLES',
  MANAGE_PERMISSIONS: 'MANAGE_PERMISSIONS',
  VIEW_PERMISSIONS: 'VIEW_PERMISSIONS',
  CREATE_PERMISSIONS: 'CREATE_PERMISSIONS',
  UPDATE_PERMISSIONS: 'UPDATE_PERMISSIONS',
  DELETE_PERMISSIONS: 'DELETE_PERMISSIONS',
  MANAGE_ORDERS: 'MANAGE_ORDERS',
  VIEW_ORDERS: 'VIEW_ORDERS',
  CREATE_ORDERS: 'CREATE_ORDERS',
  UPDATE_ORDERS: 'UPDATE_ORDERS',
  DELETE_ORDERS: 'DELETE_ORDERS',
  MANAGE_EMPLOYEES: 'MANAGE_EMPLOYEES',
  VIEW_EMPLOYEES: 'VIEW_EMPLOYEES',
  CREATE_EMPLOYEES: 'CREATE_EMPLOYEES',
  UPDATE_EMPLOYEES: 'UPDATE_EMPLOYEES',
  DELETE_EMPLOYEES: 'DELETE_EMPLOYEES',
  MANAGE_INVENTORY: 'MANAGE_INVENTORY',
  VIEW_INVENTORY: 'VIEW_INVENTORY',
  CREATE_INVENTORY: 'CREATE_INVENTORY',
  UPDATE_INVENTORY: 'UPDATE_INVENTORY',
  DELETE_INVENTORY: 'DELETE_INVENTORY'
};

const { Roles } = require('./roles');

module.exports.PermissionDescriptions = {
  [module.exports.Permissions.MANAGE_PRODUCTS]: 'Create, update, view, and delete products',
  [module.exports.Permissions.VIEW_PRODUCTS]: 'View products',
  [module.exports.Permissions.CREATE_PRODUCTS]: 'Create products',
  [module.exports.Permissions.UPDATE_PRODUCTS]: 'Update products',
  [module.exports.Permissions.DELETE_PRODUCTS]: 'Delete products',
  [module.exports.Permissions.MANAGE_SALES]: 'Create, update, view, and delete sales',
  [module.exports.Permissions.VIEW_SALES]: 'View sales',
  [module.exports.Permissions.CREATE_SALES]: 'Create sales',
  [module.exports.Permissions.UPDATE_SALES]: 'Update sales',
  [module.exports.Permissions.DELETE_SALES]: 'Delete sales',
  [module.exports.Permissions.VIEW_REPORTS]: 'View reports',
  [module.exports.Permissions.MANAGE_ROLES]: 'Create, update, view, and delete roles',
  [module.exports.Permissions.VIEW_ROLES]: 'View roles',
  [module.exports.Permissions.CREATE_ROLES]: 'Create roles',
  [module.exports.Permissions.UPDATE_ROLES]: 'Update roles',
  [module.exports.Permissions.DELETE_ROLES]: 'Delete roles',
  [module.exports.Permissions.MANAGE_PERMISSIONS]: 'Create, update, view, and delete permissions',
  [module.exports.Permissions.VIEW_PERMISSIONS]: 'View permissions',
  [module.exports.Permissions.CREATE_PERMISSIONS]: 'Create permissions',
  [module.exports.Permissions.UPDATE_PERMISSIONS]: 'Update permissions',
  [module.exports.Permissions.DELETE_PERMISSIONS]: 'Delete permissions',
  [module.exports.Permissions.MANAGE_ORDERS]: 'Create, update, view, and delete orders',
  [module.exports.Permissions.VIEW_ORDERS]: 'View orders',
  [module.exports.Permissions.CREATE_ORDERS]: 'Create orders',
  [module.exports.Permissions.UPDATE_ORDERS]: 'Update orders',
  [module.exports.Permissions.DELETE_ORDERS]: 'Delete orders',
  [module.exports.Permissions.MANAGE_EMPLOYEES]: 'Create, update, view, and delete employees',
  [module.exports.Permissions.VIEW_EMPLOYEES]: 'View employees',
  [module.exports.Permissions.CREATE_EMPLOYEES]: 'Create employees',
  [module.exports.Permissions.UPDATE_EMPLOYEES]: 'Update employees',
  [module.exports.Permissions.DELETE_EMPLOYEES]: 'Delete employees',
  [module.exports.Permissions.MANAGE_INVENTORY]: 'Create, update, view, and delete inventory',
  [module.exports.Permissions.VIEW_INVENTORY]: 'View inventory',
  [module.exports.Permissions.CREATE_INVENTORY]: 'Create inventory',
  [module.exports.Permissions.UPDATE_INVENTORY]: 'Update inventory',
  [module.exports.Permissions.DELETE_INVENTORY]: 'Delete inventory'
};

module.exports.PermissionList = Object.values(module.exports.Permissions);

function titleCasePermission(slug) {
  return String(slug)
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getPermissionModule(slug) {
  const parts = String(slug).toLowerCase().split('_');
  return parts[parts.length - 1];
}

function getPermissionName(slug) {
  return titleCasePermission(slug);
}

module.exports.getPermissionModule = getPermissionModule;
module.exports.getPermissionName = getPermissionName;
module.exports.getDefaultPermissionPayloads = () => module.exports.PermissionList.map((slug) => ({
  name: getPermissionName(slug),
  slug,
  module: getPermissionModule(slug)
}));

module.exports.RolePermissions = {
  [Roles.ADMIN]: module.exports.PermissionList,
  [Roles.MANAGER]: [
    module.exports.Permissions.VIEW_USERS,
    module.exports.Permissions.MANAGE_PRODUCTS,
    module.exports.Permissions.MANAGE_SALES,
    module.exports.Permissions.VIEW_REPORTS,
    module.exports.Permissions.MANAGE_ORDERS,
    module.exports.Permissions.MANAGE_EMPLOYEES,
    module.exports.Permissions.MANAGE_INVENTORY
  ],
  [Roles.CASHIER]: [
    module.exports.Permissions.VIEW_PRODUCTS,
    module.exports.Permissions.VIEW_INVENTORY,
    module.exports.Permissions.MANAGE_SALES,
    module.exports.Permissions.MANAGE_ORDERS
  ],
  [Roles.EMPLOYEE]: [
    module.exports.Permissions.VIEW_PRODUCTS,
    module.exports.Permissions.VIEW_INVENTORY,
    module.exports.Permissions.VIEW_ORDERS
  ]
};
