const { Sequelize } = require('sequelize');
require('dotenv').config();

const {
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_DIALECT,
  DB_PORT,
} = process.env;

// Log loaded env variables
console.log("🔍 Loaded environment variables:");
console.log({
  DB_NAME,
  DB_USER,
  DB_PASSWORD: DB_PASSWORD ? '✅ [HIDDEN]' : '❌ [EMPTY]',
  DB_HOST,
  DB_DIALECT,
  DB_PORT,
});

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: DB_DIALECT || 'mysql',
  logging: false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`✅ Connected to ${DB_DIALECT} database: ${DB_NAME}`);
  } catch (error) {
    console.error('❌ Database connection error:', error);
  }
};

module.exports = { sequelize, connectDB };
