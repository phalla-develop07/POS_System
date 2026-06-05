const { EntitySchema } = require('typeorm');

const SaleItemSchema = new EntitySchema({
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
      precision: 12,
      scale: 2
    },
    lineTotal: {
      name: 'line_total',
      type: 'decimal',
      precision: 12,
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
      onDelete: 'CASCADE',
      nullable: false
    },
    product: {
      type: 'many-to-one',
      target: 'Product',
      joinColumn: {
        name: 'product_id'
      },
      onDelete: 'RESTRICT',
      nullable: false,
      eager: true
    }
  }
});

module.exports.SaleItemSchema = SaleItemSchema;
