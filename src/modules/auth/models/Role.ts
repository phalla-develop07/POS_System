import { EntitySchema } from 'typeorm';

export interface Role {
  id: number;
  name: string;
  description?: string | null;
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
  }
});
