import { EntitySchema } from 'typeorm';

export interface Category {
  id: number;
  name: string;
  description?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const CategorySchema = new EntitySchema<Category>({
  name: 'Category',
  tableName: 'categories',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true
    },
    name: {
      type: String,
      length: 100,
      unique: true
    },
    description: {
      type: String,
      length: 255,
      nullable: true
    },
    isActive: {
      name: 'is_active',
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
