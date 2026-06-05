const { EntitySchema } = require('typeorm');

const InventoryLogSchema = new EntitySchema({
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
      onDelete: 'CASCADE',
      nullable: false
    },
    user: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: {
        name: 'user_id'
      },
      onDelete: 'RESTRICT',
      nullable: false
    }
  }
});

module.exports.InventoryLogSchema = InventoryLogSchema;
