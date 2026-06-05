import { EntitySchema } from 'typeorm';

export interface Product {
  id: number;
  sku?: string | null;
  name: string;
  description?: string | null;
  price: string | number;
  stock: number;
  lowStockThreshold: number;
  isActive: boolean;
  imageUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const ProductSchema = new EntitySchema<Product>({
  name: 'Product',
  tableName: 'products',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true
    },
    sku: {
      type: String,
      length: 100,
      unique: true,
      nullable: true
    },
    name: {
      type: String,
      length: 150
    },
    description: {
      type: String,
      length: 500,
      nullable: true
    },
    price: {
      type: 'decimal',
      precision: 10,
      scale: 2,
      default: 0
    },
    stock: {
      type: 'int',
      default: 0
    },
    lowStockThreshold: {
      name: 'low_stock_threshold',
      type: 'int',
      default: 5
    },
    isActive: {
      name: 'is_active',
      type: Boolean,
      default: true
    },
    imageUrl: {
      name: 'image_url',
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
