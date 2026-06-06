import { EntitySchema } from 'typeorm';
import type { Product } from '../../product/models/Product';
import type { Sale } from './Sale';

export interface SaleItem {
  id: number;
  quantity: number;
  unitPrice: string | number;
  lineTotal: string | number;
  sale: Sale;
  product: Product;
  createdAt: Date;
}

export const SaleItemSchema = new EntitySchema<SaleItem>({
  name: 'SaleItem',
  tableName: 'sale_items',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true
    },
    quantity: {
      type: Number
    },
    unitPrice: {
      name: 'unit_price',
      type: 'decimal',
      precision: 10,
      scale: 2
    },
    lineTotal: {
      name: 'line_total',
      type: 'decimal',
      precision: 10,
      scale: 2
    },
    createdAt: {
      name: 'created_at',
      type: Date,
      createDate: true
    }
  },
  relations: {
    sale: {
      type: 'many-to-one',
      target: 'Sale',
      joinColumn: {
        name: 'sale_id'
      },
      inverseSide: 'items',
      onDelete: 'CASCADE',
      nullable: false
    },
    product: {
      type: 'many-to-one',
      target: 'Product',
      joinColumn: {
        name: 'product_id'
      },
      inverseSide: 'saleItems',
      onDelete: 'RESTRICT',
      nullable: false,
      eager: true
    }
  }
});
