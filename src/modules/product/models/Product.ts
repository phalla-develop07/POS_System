import { EntitySchema } from 'typeorm';
import type { Category } from '../../category/models/Category';
import type { InventoryLog } from '../../inventory/models/InventoryLog';
import type { InventoryTransaction } from '../../inventory/models/InventoryTransaction';
import type { SaleItem } from '../../sales/models/SaleItem';

export interface Product {
  id: number;
  categoryId?: number | null;
  category?: Category | null;
  sku?: string | null;
  name: string;
  description?: string | null;
  price: string | number;
  stock: number;
  inventoryTransactions?: InventoryTransaction[];
  inventoryLogs?: InventoryLog[];
  saleItems?: SaleItem[];
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
    categoryId: {
      name: 'category_id',
      type: Number,
      nullable: true
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
  },
  relations: {
    category: {
      type: 'many-to-one',
      target: 'Category',
      joinColumn: {
        name: 'category_id'
      },
      inverseSide: 'products',
      onDelete: 'SET NULL',
      nullable: true
    },
    inventoryTransactions: {
      type: 'one-to-many',
      target: 'InventoryTransaction',
      inverseSide: 'product'
    },
    inventoryLogs: {
      type: 'one-to-many',
      target: 'InventoryLog',
      inverseSide: 'product'
    },
    saleItems: {
      type: 'one-to-many',
      target: 'SaleItem',
      inverseSide: 'product'
    }
  }
});
