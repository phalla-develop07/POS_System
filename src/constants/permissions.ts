import { Roles } from './roles';

export const Permissions = {
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
} as const;

export const PermissionDescriptions: Record<string, string> = {
  [Permissions.MANAGE_PRODUCTS]: 'Create, update, view, and delete products',
  [Permissions.VIEW_PRODUCTS]: 'View products',
  [Permissions.CREATE_PRODUCTS]: 'Create products',
  [Permissions.UPDATE_PRODUCTS]: 'Update products',
  [Permissions.DELETE_PRODUCTS]: 'Delete products',
  [Permissions.MANAGE_SALES]: 'Create, update, view, and delete sales',
  [Permissions.VIEW_SALES]: 'View sales',
  [Permissions.CREATE_SALES]: 'Create sales',
  [Permissions.UPDATE_SALES]: 'Update sales',
  [Permissions.DELETE_SALES]: 'Delete sales',
  [Permissions.VIEW_REPORTS]: 'View reports',
  [Permissions.MANAGE_ROLES]: 'Create, update, view, and delete roles',
  [Permissions.VIEW_ROLES]: 'View roles',
  [Permissions.CREATE_ROLES]: 'Create roles',
  [Permissions.UPDATE_ROLES]: 'Update roles',
  [Permissions.DELETE_ROLES]: 'Delete roles',
  [Permissions.MANAGE_PERMISSIONS]: 'Create, update, view, and delete permissions',
  [Permissions.VIEW_PERMISSIONS]: 'View permissions',
  [Permissions.CREATE_PERMISSIONS]: 'Create permissions',
  [Permissions.UPDATE_PERMISSIONS]: 'Update permissions',
  [Permissions.DELETE_PERMISSIONS]: 'Delete permissions',
  [Permissions.MANAGE_ORDERS]: 'Create, update, view, and delete orders',
  [Permissions.VIEW_ORDERS]: 'View orders',
  [Permissions.CREATE_ORDERS]: 'Create orders',
  [Permissions.UPDATE_ORDERS]: 'Update orders',
  [Permissions.DELETE_ORDERS]: 'Delete orders',
  [Permissions.MANAGE_EMPLOYEES]: 'Create, update, view, and delete employees',
  [Permissions.VIEW_EMPLOYEES]: 'View employees',
  [Permissions.CREATE_EMPLOYEES]: 'Create employees',
  [Permissions.UPDATE_EMPLOYEES]: 'Update employees',
  [Permissions.DELETE_EMPLOYEES]: 'Delete employees',
  [Permissions.MANAGE_INVENTORY]: 'Create, update, view, and delete inventory',
  [Permissions.VIEW_INVENTORY]: 'View inventory',
  [Permissions.CREATE_INVENTORY]: 'Create inventory',
  [Permissions.UPDATE_INVENTORY]: 'Update inventory',
  [Permissions.DELETE_INVENTORY]: 'Delete inventory'
};

export const PermissionList = Object.values(Permissions);

function titleCasePermission(slug: string) {
  return String(slug)
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getPermissionModule(slug: string) {
  const parts = String(slug).toLowerCase().split('_');
  return parts[parts.length - 1];
}

export function getPermissionName(slug: string) {
  return titleCasePermission(slug);
}

export function getDefaultPermissionPayloads() {
  return PermissionList.map((slug) => ({
    name: getPermissionName(slug),
    slug,
    module: getPermissionModule(slug)
  }));
}

export const RolePermissions: Record<string, string[]> = {
  [Roles.ADMIN]: PermissionList,
  [Roles.MANAGER]: [
    Permissions.MANAGE_PRODUCTS,
    Permissions.MANAGE_SALES,
    Permissions.VIEW_REPORTS,
    Permissions.MANAGE_ORDERS,
    Permissions.MANAGE_EMPLOYEES,
    Permissions.MANAGE_INVENTORY
  ],
  [Roles.CASHIER]: [
    Permissions.VIEW_PRODUCTS,
    Permissions.VIEW_INVENTORY,
    Permissions.MANAGE_SALES,
    Permissions.MANAGE_ORDERS
  ],
  [Roles.EMPLOYEE]: [
    Permissions.VIEW_PRODUCTS,
    Permissions.VIEW_INVENTORY,
    Permissions.VIEW_ORDERS
  ]
};
