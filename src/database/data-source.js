require('reflect-metadata');
const { DataSource } = require('typeorm');
const { env } = require('../config/env');
const { RoleSchema } = require('../modules/auth/models/Role');
const { UserSchema } = require('../modules/auth/models/User');
const { ProductSchema } = require('../modules/inventory/models/Product');
const { InventoryTransactionSchema } = require('../modules/inventory/models/InventoryTransaction');
const { InventoryLogSchema } = require('../modules/inventory/models/InventoryLog');
const { SaleSchema } = require('../modules/sales/models/Sale');
const { SaleItemSchema } = require('../modules/sales/models/SaleItem');

const AppDataSource = new DataSource({
  type: 'mysql',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [RoleSchema, UserSchema, ProductSchema, InventoryTransactionSchema, InventoryLogSchema, SaleSchema, SaleItemSchema]
});

module.exports.AppDataSource = AppDataSource;
