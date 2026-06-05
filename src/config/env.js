const dotenv = require('dotenv');

dotenv.config();

const required = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_NAME', 'JWT_SECRET'];

const NODE_ENV = process.env.NODE_ENV || 'development';

// In dev, allow boot without a .env by using defaults.
// In production, fail fast to avoid running with broken config.
const isProd = NODE_ENV === 'production';

if (isProd) {
  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing environment variable: ${key}`);
    }
  }
}

module.exports.env = {
  NODE_ENV,
  PORT: Number(process.env.PORT || 3000),

  // Dev-friendly defaults
  DB_TYPE: process.env.DB_TYPE || 'sqlite',
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: Number(process.env.DB_PORT || 3306),
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '',
  DB_NAME: process.env.DB_NAME || 'smartpos_system',
  DB_PATH: process.env.DB_PATH || 'pos.sqlite',

  JWT_SECRET: process.env.JWT_SECRET || 'dev-jwt-secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d'
};

