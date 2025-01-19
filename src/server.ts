import fastify from "fastify";
const cron = require("node-cron");
import sampleData from "./data/sampleAffirmations.json";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

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
    // ca: process.env.DB_SSL_CA
    //   ? fs.readFileSync(process.env.DB_SSL_CA).toString()
    //   : undefined,
  },
};

const pool = mysql.createPool(dbConfig);

// pool
//   .getConnection()
//   .then((connection) => {
//     console.log("Database connected successfully!");
//     connection.release();
//   })
//   .catch((error) => {
//     console.error("Error connecting to the database: ", error);
//   });

const app = fastify({
  logger: true,
});

const PORT = 3002;

let dailyAffirmation = sampleData.affirmations[0];

cron.schedule("0 0 * * *", async () => {
  await fetchDailyAffirmation();
});

async function fetchDailyAffirmation() {
  try {
    dailyAffirmation = await getRandomAffirmationFromDB();
    app.log.info(`Daily affirmation: ${dailyAffirmation}`);
  } catch (err) {
    app.log.error("Error fetching daily affirmation: ", err);
    dailyAffirmation =
      sampleData.affirmations[
        Math.floor(Math.random() * sampleData.affirmations.length)
      ];
  }
}

export async function getRandomAffirmationFromDB(): Promise<string> {
  try {
    console.log("Fetching affirmation from database...");
    const [rows] = (await pool.query(
      "SELECT message FROM affirmations ORDER BY RAND() LIMIT 1",
    )) as [mysql.RowDataPacket[], mysql.FieldPacket[]];
    console.log("Query result:", rows);
    if (rows.length > 0) {
      return rows[0].message;
    }
    return "No affirmations found in the database.";
  } catch (error: any) {
    console.error("Error fetching affirmation from database:", error);
    if (error.code === "ECONNREFUSED") {
      console.error(
        "Connection refused. Please check your database credentials and network configuration.",
      );
    } else if (error.code === "ER_ACCESS_DENIED_ERROR") {
      console.error("Access denied. Please check your database credentials.");
    } else if (error.code === "ENOTFOUND") {
      console.error("Host not found. Please check your database host.");
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
}

app.get("/daily-affirmation", async (req, rep) => {
  return {
    message: dailyAffirmation,
  };
});

const start = async () => {
  try {
    await app.listen({ port: PORT });
    await fetchDailyAffirmation();
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();
