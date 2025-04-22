// import mongoose from "mongoose";
// import sql from "mssql";
import mysql from "mysql2";
import { promisify } from "util";
import dotenv from "dotenv";

dotenv.config();

// MongoDB connection
// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI);

//     // console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error(`Error: ${error.message}`);
//     process.exit(1);
//   }
// };

// export default connectDB;

// SQL Server connection
// const sqlConfig = {
//   user: process.env.DB_USER,
//   password: process.env.DB_PWD,
//   database: process.env.DB_NAME,
//   server: "localhost",
//   pool: {
//     max: 10,
//     min: 0,
//     idleTimeoutMillis: 30000,
//   },
//   options: {
//     encrypt: false,
//     trustServerCertificate: false, // change to true for local dev / self-signed certs
//   },
// };

// export const connectSQLServer = async () => {
//   try {
//     // make sure that any items are correctly URL encoded in the connection string
//     await sql.connect(sqlConfig);
//     // console.log("Connected to SQL Server");
//   } catch (err) {
//     console.error(err);
//   }
// };

// export const executeQuery = async (query, params = {}) => {
//   try {
//     await connectSQLServer();
//     const request = new sql.Request();

//     for (const [key, value] of Object.entries(params)) {
//       request.input(key, value);
//     }

//     const result = await request.query(query);
//     return result.recordset;
//   } catch (error) {
//     console.error("Error executing query:", error);
//     throw error;
//   }
// };

// export const closeSQLConnection = async () => {
//   try {
//     await sql.close();
//   } catch (error) {
//     console.error("Error closing SQL Server:", error);
//   }
// };

// Mysql Connection
const mysql_config = {
  host: process.env.MYSQL_HOST,
  user: process.env.MySQL_USER,
  password: process.env.MySQL_PWD,
  database: process.env.MySQL_DB_NAME,
};
// many connections
const pool = mysql.createPool(mysql_config);

// Convert group query function to promise to use async/await
pool.query = promisify(pool.query);

/**
 * Execute query SQL.
 * @param {string} sql - SQL query.
 * @param {Array} values - Array of values ​​for the query (if any).
 * @returns {Promise<any>} - Query results.
 */
export const executeMysqlQuery = async (sql, values) => {
  try {
    return await pool.query(sql, values);
  } catch (error) {
    console.error("Query error:", error);
    throw error;
  }
};
