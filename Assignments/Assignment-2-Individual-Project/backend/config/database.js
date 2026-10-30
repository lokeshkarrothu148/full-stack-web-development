/**
 * ====================================================================
 * Database Configuration & Connection Pool
 * File: config/database.js
 * ====================================================================
 * Connects to the MySQL database using mysql2/promise connection pooling.
 * Using a connection pool ensures high efficiency, auto-reconnection,
 * and concurrent query support without repeatedly opening socket connections.
 * ====================================================================
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

// Create connection pool with environment variable fallbacks
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'collegehub',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Helper function to test database connectivity at server startup
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log(`[Database] Successfully connected to MySQL database: "${process.env.DB_NAME || 'collegehub'}"`);
    connection.release();
  } catch (error) {
    console.error('[Database Error] Failed to connect to MySQL database:');
    console.error(`  Reason: ${error.message}`);
    console.error('  Please ensure MySQL server is running and .env credentials match.');
  }
}

// Perform initial connection test
testConnection();

module.exports = pool;

