require('reflect-metadata');
const { DataSource } = require('typeorm');
const { env } = require('../config/env');
const { RoleSchema } = require('../modules/auth/models/Role');
const { UserSchema } = require('../modules/auth/models/User');
const { ProductSchema } = require('../modules/inventory/models/Product');
const { InventoryTransactionSchema } = require('../modules/inventory/models/InventoryTransaction');
const { InventoryLogSchema } = require('../modules/inventory/models/InventoryLog');

const AppDataSource = new DataSource({
  type: 'mysql',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [RoleSchema, UserSchema, ProductSchema, InventoryTransactionSchema, InventoryLogSchema]
});

module.exports.AppDataSource = AppDataSource;
