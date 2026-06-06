import { EntitySchema } from 'typeorm';
import type { Permission } from '../../permissions/models/Permission';
import type { User } from './User';

export interface Role {
  id: number;
  name: string;
  description?: string | null;
  users?: User[];
  permissions?: Permission[];
  createdAt: Date;
  updatedAt: Date;
}

export const RoleSchema = new EntitySchema<Role>({
  name: 'Role',
  tableName: 'roles',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true
    },
    name: {
      type: String,
      length: 50,
      unique: true
    },
    description: {
      type: String,
      length: 255,
      nullable: true
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
    users: {
      type: 'one-to-many',
      target: 'User',
      inverseSide: 'roleEntity'
    },
    permissions: {
      type: 'many-to-many',
      target: 'Permission',
      inverseSide: 'roles',
      joinTable: {
        name: 'role_permissions',
        joinColumn: {
          name: 'role_id',
          referencedColumnName: 'id'
        },
        inverseJoinColumn: {
          name: 'permission_id',
          referencedColumnName: 'id'
        }
      }
    }
  }
});
