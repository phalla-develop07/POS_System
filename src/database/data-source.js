require('dotenv').config();
require('reflect-metadata');

const { DataSource } = require('typeorm');
const { CategorySchema } = require('../modules/category/models/Category');

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [CategorySchema]
});

module.exports.AppDataSource = AppDataSource;
