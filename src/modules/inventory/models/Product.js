const { EntitySchema } = require('typeorm');

const ProductSchema = new EntitySchema({
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
      unique: true
    },
    name: {
      type: String,
      length: 150
    },
    description: {
      type: String,
      length: 255,
      nullable: true
    },
    currentStock: {
      name: 'current_stock',
      type: Number,
      default: 0
    },
    lowStockThreshold: {
      name: 'low_stock_threshold',
      type: Number,
      default: 5
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

module.exports.ProductSchema = ProductSchema;
