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
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: Number(process.env.DB_PORT || 5432),
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : 'postgres',
  DB_NAME: process.env.DB_NAME || 'pos',

  JWT_SECRET: process.env.JWT_SECRET || 'dev-jwt-secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d'
};

