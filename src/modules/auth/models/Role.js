const { EntitySchema } = require('typeorm');

const RoleSchema = new EntitySchema({
  name: 'Role',
  tableName: 'roles',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true
    },
    name: {
      type: String,
      length: 50,
      unique: true
    },
    description: {
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

module.exports.RoleSchema = RoleSchema;
