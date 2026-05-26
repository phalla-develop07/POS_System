const { EntitySchema } = require('typeorm');

const CategorySchema = new EntitySchema({
  name: 'Category',
  tableName: 'categories',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true
    },
    name: {
      type: String,
      length: 100,
      unique: true
    },
    description: {
      type: String,
      length: 255,
      nullable: true
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

module.exports.CategorySchema = CategorySchema;
