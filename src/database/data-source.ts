import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from '../config/env';
import { RoleSchema } from '../modules/auth/models/Role';
import { UserSchema } from '../modules/auth/models/User';
import { ProductSchema } from '../modules/inventory/models/Product';
import { InventoryTransactionSchema } from '../modules/inventory/models/InventoryTransaction';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [RoleSchema, UserSchema, ProductSchema, InventoryTransactionSchema]
});
