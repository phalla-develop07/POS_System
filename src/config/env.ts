import dotenv from 'dotenv';

dotenv.config();

const required = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_NAME', 'JWT_SECRET'] as const;

const NODE_ENV = process.env.NODE_ENV || 'development';

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
}

export const env = {
  NODE_ENV,
  PORT: Number(process.env.PORT || 3000),
  DB_TYPE: process.env.DB_TYPE || 'mysql',
  DB_HOST: process.env.DB_HOST as string,
  DB_PORT: Number(process.env.DB_PORT),
  DB_USER: process.env.DB_USER as string,
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME as string,
  DB_PATH: process.env.DB_PATH || './pos.sqlite',
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d'
};
