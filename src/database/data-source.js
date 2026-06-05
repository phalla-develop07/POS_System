require('reflect-metadata');
const { DataSource } = require('typeorm');
const { env } = require('../config/env');
const { RoleSchema } = require('../modules/auth/models/Role');
const { UserSchema } = require('../modules/auth/models/User');
const { PermissionSchema } = require('../modules/permissions/models/Permission');
const { ProductSchema } = require('../modules/product/models/Product');
const { CategorySchema } = require('../modules/category/models/Category');

const AppDataSource = new DataSource({
  type: 'mysql',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [RoleSchema, UserSchema, CategorySchema, ProductSchema, PermissionSchema]
});

module.exports.AppDataSource = AppDataSource;
