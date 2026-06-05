const { EntitySchema } = require('typeorm');

const InventoryTransactionSchema = new EntitySchema({
  name: 'InventoryTransaction',
  tableName: 'inventory_transactions',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true
    },
    movementType: {
      name: 'movement_type',
      type: 'enum',
      enum: ['IN', 'OUT']
    },
    quantity: {
      type: Number
    },
    previousStock: {
      name: 'previous_stock',
      type: Number
    },
    newStock: {
      name: 'new_stock',
      type: Number
    },
    reason: {
      type: String,
      length: 255,
      nullable: true
    },
    reference: {
      type: String,
      length: 120,
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
      onDelete: 'CASCADE',
      nullable: false,
      eager: true
    }
  }
});

module.exports.InventoryTransactionSchema = InventoryTransactionSchema;
