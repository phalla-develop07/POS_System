import { EntitySchema } from 'typeorm';
import type { InventoryLog } from '../../inventory/models/InventoryLog';
import type { Role } from './Role';
import type { Sale } from '../../sales/models/Sale';

export interface User {
  id: number;
  email: string;
  passwordHash: string;
  role: string;
  roleEntity?: Role | null;
  inventoryLogs?: InventoryLog[];
  sales?: Sale[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = new EntitySchema<User>({
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true
    },
    email: {
      type: String,
      length: 150,
      unique: true
    },
    passwordHash: {
      name: 'password_hash',
      type: String,
      length: 255
    },
    role: {
      type: String,
      default: 'CASHIER'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      name: 'created_at',
      type: Date,
      createDate: true
    },
    updatedAt: {
      name: 'updated_at',
      type: Date,
      updateDate: true
    }
  },
  relations: {
    roleEntity: {
      type: 'many-to-one',
      target: 'Role',
      joinColumn: {
        name: 'role',
        referencedColumnName: 'name'
      },
      inverseSide: 'users',
      onDelete: 'RESTRICT',
      nullable: true
    },
    inventoryLogs: {
      type: 'one-to-many',
      target: 'InventoryLog',
      inverseSide: 'user'
    },
    sales: {
      type: 'one-to-many',
      target: 'Sale',
      inverseSide: 'cashier'
    }
  }
});
