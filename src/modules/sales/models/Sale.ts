import { EntitySchema } from 'typeorm';
import type { User } from '../../auth/models/User';
import type { SaleItem } from './SaleItem';

export interface Sale {
  id: number;
  receiptNumber: string;
  status: string;
  subtotal: string | number;
  total: string | number;
  paymentAmount: string | number;
  changeAmount: string | number;
  cashier?: User | null;
  items?: SaleItem[];
  createdAt: Date;
  updatedAt: Date;
}

export const SaleSchema = new EntitySchema<Sale>({
  name: 'Sale',
  tableName: 'sales',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true
    },
    receiptNumber: {
      name: 'receipt_number',
      type: String,
      length: 80,
      unique: true
    },
    status: {
      type: String,
      length: 20,
      default: 'PAID'
    },
    subtotal: {
      type: 'decimal',
      precision: 10,
      scale: 2,
      default: 0
    },
    total: {
      type: 'decimal',
      precision: 10,
      scale: 2,
      default: 0
    },
    paymentAmount: {
      name: 'payment_amount',
      type: 'decimal',
      precision: 10,
      scale: 2,
      default: 0
    },
    changeAmount: {
      name: 'change_amount',
      type: 'decimal',
      precision: 10,
      scale: 2,
      default: 0
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
    cashier: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: {
        name: 'cashier_id'
      },
      inverseSide: 'sales',
      onDelete: 'SET NULL',
      nullable: true
    },
    items: {
      type: 'one-to-many',
      target: 'SaleItem',
      inverseSide: 'sale',
      cascade: true
    }
  }
});
