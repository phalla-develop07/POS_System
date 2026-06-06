import 'reflect-metadata';
import { DataSource, type DataSourceOptions } from 'typeorm';
import { env } from '../config/env';
import { RoleSchema } from '../modules/auth/models/Role';
import { UserSchema } from '../modules/auth/models/User';
import { PermissionSchema } from '../modules/permissions/models/Permission';
import { ProductSchema } from '../modules/product/models/Product';
import { CategorySchema } from '../modules/category/models/Category';
import { InventoryTransactionSchema } from '../modules/inventory/models/InventoryTransaction';
import { InventoryLogSchema } from '../modules/inventory/models/InventoryLog';

const entities = [
  RoleSchema,
  UserSchema,
  CategorySchema,
  ProductSchema,
  PermissionSchema,
  InventoryTransactionSchema,
  InventoryLogSchema
];

const commonOptions = {
  synchronize: true,
  logging: false,
  entities
};

const dataSourceOptions: DataSourceOptions = env.DB_TYPE === 'sqlite'
  ? {
      ...commonOptions,
      type: 'sqlite',
      database: env.DB_PATH
    }
  : {
      ...commonOptions,
      type: 'postgres',
      host: env.DB_HOST,
      port: env.DB_PORT,
      username: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_NAME
    };

export const AppDataSource = new DataSource(dataSourceOptions);
