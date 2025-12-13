import mysql from "mysql2";
import { promisify } from "util";
import dotenv from "dotenv";

dotenv.config();

// Mysql Connection
const mysql_config = {
  host: process.env.MYSQL_HOST,
  user: process.env.MySQL_USER,
  password: process.env.MySQL_PWD,
  database: process.env.MySQL_DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

// Create connection pool
const pool = mysql.createPool(mysql_config);

// Convert pool query function to promise to use async/await
pool.query = promisify(pool.query);
pool.getConnection = promisify(pool.getConnection);

/**
 * Execute SQL query with connection pool
 * @param {string} sql - SQL query
 * @param {Array} values - Array of values for the query (if any)
 * @returns {Promise<any>} - Query results
 */
export const executeMysqlQuery = async (sql, values) => {
  try {
    return await pool.query(sql, values);
  } catch (error) {
    console.error("Query error:", error);
    throw error;
  }
};

/**
 * Get a connection from the pool for transaction
 * @returns {Promise<Connection>} - MySQL connection
 */
export const getConnection = async () => {
  try {
    const connection = await pool.getConnection();
    // Promisify connection methods
    connection.query = promisify(connection.query);
    connection.beginTransaction = promisify(connection.beginTransaction);
    connection.commit = promisify(connection.commit);
    connection.rollback = promisify(connection.rollback);
    return connection;
  } catch (error) {
    console.error("Error getting connection:", error);
    throw error;
  }
};

/**
 * Execute multiple queries in a transaction
 * @param {Function} callback - Async function that receives connection and executes queries
 * @returns {Promise<any>} - Result of the transaction
 * @example
 * await executeTransaction(async (connection) => {
 *   await connection.query("INSERT INTO ...", [values]);
 *   await connection.query("UPDATE ...", [values]);
 * });
 */
export const executeTransaction = async (callback) => {
  const connection = await getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    console.error("Transaction error:", error);
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Gracefully close the connection pool
 */
export const closePool = async () => {
  try {
    await pool.end();
    console.log("MySQL connection pool closed");
  } catch (error) {
    console.error("Error closing pool:", error);
    throw error;
  }
};

// Handle process termination
process.on("SIGINT", async () => {
  await closePool();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await closePool();
  process.exit(0);
});
