import { EntitySchema } from 'typeorm';

export interface User {
  id: number;
  email: string;
  passwordHash: string;
  role: string;
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
  }
});
