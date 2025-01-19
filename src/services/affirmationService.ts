import { pool } from "../config/database";
import mysql from "mysql2/promise";
import sampleData from "../data/sampleAffirmations.json";

export class AffirmationService {
  static async getRandomAffirmationFromDB(): Promise<string> {
    try {
      console.log("Fetching affirmation from database...");
      const [rows] = (await pool.query(
        "SELECT message FROM affirmations ORDER BY RAND() LIMIT 1",
      )) as [mysql.RowDataPacket[], mysql.FieldPacket[]];

      if (rows.length > 0) {
        return rows[0].message;
      }
      return "No affirmations found in the database.";
    } catch (error: any) {
      console.error("Error fetching affirmation from database:", error);
      throw error;
    }
  }

  static getFallbackAffirmation(): string {
    return sampleData.affirmations[
      Math.floor(Math.random() * sampleData.affirmations.length)
    ];
  }
}
