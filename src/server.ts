import fastify from "fastify";
const cron = require('node-cron')
import sampleData from "./data/sampleAffirmations.json";
import mysql from 'mysql2/promise'

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
}

const pool = mysql.createPool(dbConfig)

const app = fastify({
  logger: true,
})

const PORT = 3002

let dailyAffirmation = sampleData.affirmations[0]

cron.schedule("0 0 * * *", () => {
  fetchDailyAffirmation();
})

// function fetchDailyAffirmation() {
//   try {
//     dailyAffirmation =
//       sampleData.affirmations[
//         Math.floor(Math.random() * sampleData.affirmations.length)
//       ];
//     app.log.info(`Daily affirmation: ${dailyAffirmation}`);
//   } catch (err) {
//     app.log.error("Error fetching daily affirmation: ", err);
//     dailyAffirmation =
//       sampleData.affirmations[
//         Math.floor(Math.random() * sampleData.affirmations.length)
//       ];
//   }
// }

async function fetchDailyAffirmation() {
  try {
    dailyAffirmation = await getRandomAffirmationFromDB();
    app.log.info(`Daily affirmation: ${dailyAffirmation}`);
  } catch (err) {
    app.log.error("Error fetching daily affirmation: ", err);
    // Fallback to a default message or handle the error as needed
    dailyAffirmation = "Error fetching affirmation.";
  }
}

export async function getRandomAffirmationFromDB(): Promise<string> {
  try {
    const [rows] = await pool.query('SELECT message FROM affirmations ORDER BY RAND() LIMIT 1') as [mysql.RowDataPacket[], mysql.FieldPacket[]];
    if (rows.length > 0) 
      return rows[0].message;
    return 'No affirmations found in the database.';
  } catch (error) {
    console.error('Error fetching affirmation from database:', error);
    throw error;
  }
}

app.get('/daily-affirmation', async (req, rep) => {
  return {
    message: dailyAffirmation
  }
})

const start = async () => {
    try {
        await app.listen({ port: PORT });
        await fetchDailyAffirmation();
    } catch (error) {
        app.log.error(error);
        process.exit(1);
    }
}
  
start()