// db.js
const mysql = require('mysql2');

// Create connection *without* specifying the DB initially
const baseConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
});

baseConnection.query('CREATE DATABASE IF NOT EXISTS wdmecomm', (err) => {
  if (err) {
    console.error('Failed to create database:', err);
    return;
  }
  console.log('Database "wdmecomm" is ready');

  // Step 2: Connect to the actual database
  const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'wdmecomm',
  });

  db.connect((err) => {
    if (err) {
      console.error('Error connecting to the "wdmecomm" database:', err);
      return;
    }
    console.log('Connected to the "wdmecomm" database');
  });

  // Export the connected instance
  module.exports = db;

  // Optional: close the initial connection
  baseConnection.end();
});
