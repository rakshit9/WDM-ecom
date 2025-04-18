const { Sequelize } = require('sequelize');
require('dotenv').config();

// Log everything at the top
console.log("🔍 Loaded environment variables:");
console.log({
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD ? "✅ [HIDDEN]" : "❌ [EMPTY]",
  DB_HOST: process.env.DB_HOST,
  DB_DIALECT: process.env.DB_DIALECT,
  DB_PORT: process.env.DB_PORT,
});

// Assign with fallbacks
const DB_NAME = process.env.DB_NAME || "railway";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "DmdyoVeLukbBqEFvURJCUJzRNNnPYDbO";
const DB_HOST = process.env.DB_HOST || "trolley.proxy.rlwy.net";
const DB_DIALECT = process.env.DB_DIALECT || "mysql";
const DB_PORT = process.env.DB_PORT || 38467;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: DB_DIALECT,
  logging: false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`✅ Connected to ${DB_DIALECT} database: ${DB_NAME} at ${DB_HOST}:${DB_PORT}`);
  } catch (error) {
    console.error('❌ Database connection error:', error);
  }
};

module.exports = { sequelize, connectDB };
