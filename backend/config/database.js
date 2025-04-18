// config/database.js
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

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT, // ✅ Important for Railway
  dialect: DB_DIALECT,
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


// PORT=5010
// MONGO_URI=mongodb://localhost:27017/ecommerce-groceries
// JWT_SECRET=ecommerceAI
// DB_DIALECT=mysql       # or 'postgres'
// DB_NAME=wdmecomm
// DB_USER=root
// DB_PASSWORD=
// DB_HOST=localhost
