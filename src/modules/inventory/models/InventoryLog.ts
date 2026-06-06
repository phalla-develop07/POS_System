import { EntitySchema } from 'typeorm';
import type { Product } from './Product';
import type { User } from '../../auth/models/User';

export interface InventoryLog {
  id: number;
  actionType: string;
  quantity: number;
  note?: string | null;
  createdAt: Date;
  product: Product;
  user: User;
}

export const InventoryLogSchema = new EntitySchema<InventoryLog>({
  name: 'InventoryLog',
  tableName: 'inventory_logs',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true
    },
    actionType: {
      name: 'action_type',
      type: String,
      length: 50
    },
    quantity: {
      type: Number,
      default: 0
    },
    note: {
      type: String,
      length: 255,
      nullable: true
    },
    createdAt: {
      name: 'created_at',
      type: Date,
      createDate: true
    }
  },
  relations: {
    product: {
      type: 'many-to-one',
      target: 'Product',
      joinColumn: {
        name: 'product_id'
      },
      inverseSide: 'inventoryLogs',
      onDelete: 'CASCADE',
      nullable: false
    },
    user: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: {
        name: 'user_id'
      },
      inverseSide: 'inventoryLogs',
      onDelete: 'RESTRICT',
      nullable: false
    }
  }
});
