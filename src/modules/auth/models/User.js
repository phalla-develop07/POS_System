const { EntitySchema } = require('typeorm');

const UserSchema = new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true
    },
    email: {
      type: String,
      length: 150,
      unique: true
    },
    passwordHash: {
      name: 'password_hash',
      type: String,
      length: 255
    },
    role: {
      type: String,
      default: 'CASHIER'
    },
    isActive: {
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

module.exports.UserSchema = UserSchema;
