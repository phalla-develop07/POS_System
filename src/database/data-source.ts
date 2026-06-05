import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from '../config/env';
import { RoleSchema } from '../modules/auth/models/Role';
import { UserSchema } from '../modules/auth/models/User';
import { ProductSchema } from '../modules/product/models/Product';

export const AppDataSource = new DataSource({
  type: env.DB_TYPE === 'sqlite' ? 'sqlite' : 'mysql',
  host: env.DB_TYPE === 'sqlite' ? undefined : env.DB_HOST,
  port: env.DB_TYPE === 'sqlite' ? undefined : env.DB_PORT,
  username: env.DB_TYPE === 'sqlite' ? undefined : env.DB_USER,
  password: env.DB_TYPE === 'sqlite' ? undefined : env.DB_PASSWORD,
  database: env.DB_TYPE === 'sqlite' ? env.DB_PATH : env.DB_NAME,
  storage: env.DB_TYPE === 'sqlite' ? env.DB_PATH : undefined,
  synchronize: true,
  logging: false,
  entities: [RoleSchema, UserSchema, ProductSchema]
});
