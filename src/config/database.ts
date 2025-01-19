import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

if (
  !process.env.DB_HOST ||
  !process.env.DB_USER ||
  !process.env.DB_PASSWORD ||
  !process.env.DB_DATABASE
) {
  throw new Error("Missing required database environment variables");
}

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3300,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: {
    rejectUnauthorized: false,
    ca: process.env.DB_SSL_CA_CONTENT
      ? Buffer.from(process.env.DB_SSL_CA_CONTENT, "base64").toString()
      : undefined,
  },
};

export const pool = mysql.createPool(dbConfig);

export async function createDatabaseConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("Database connection pool initialized");
    connection.release();
  } catch (error) {
    console.error("Error initializing database pool:", error);
    throw error;
  }
}
