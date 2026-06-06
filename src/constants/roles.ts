export const Roles = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  CASHIER: 'CASHIER',
  EMPLOYEE: 'EMPLOYEE'
} as const;

export const RoleDescriptions: Record<string, string> = {
  [Roles.ADMIN]: 'Administrator with full system access',
  [Roles.MANAGER]: 'Manager with product, sales, order, employee, and inventory access',
  [Roles.CASHIER]: 'Cashier with sales and order access',
  [Roles.EMPLOYEE]: 'Employee with basic POS access'
};

export const RoleList = Object.values(Roles);
