import { EntitySchema } from 'typeorm';

export interface Permission {
  id: number;
  name: string;
  slug: string;
  module: string;
  createdAt: Date;
  updatedAt: Date;
}

export const PermissionSchema = new EntitySchema<Permission>({
  name: 'Permission',
  tableName: 'permissions',
  columns: {
    id: {
      type: 'bigint',
      primary: true,
      generated: true
    },
    name: {
      type: String,
      length: 100
    },
    slug: {
      type: String,
      length: 100,
      unique: true
    },
    module: {
      type: String,
      length: 100
    },
    createdAt: {
      name: 'created_at',
      type: 'timestamp',
      createDate: true
    },
    updatedAt: {
      name: 'updated_at',
      type: 'timestamp',
      updateDate: true
    }
  }
});
