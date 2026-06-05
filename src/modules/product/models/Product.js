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

module.exports.ProductSchema = ProductSchema;
