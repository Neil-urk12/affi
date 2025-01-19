import { FastifyInstance } from "fastify";
const cron = require("node-cron");
import { AffirmationService } from "../services/affirmationService";

export function setupDailyAffirmationJob(
  app: FastifyInstance,
  setDailyAffirmation: (affirmation: string) => void,
) {
  async function fetchDailyAffirmation() {
    try {
      const affirmation = await AffirmationService.getRandomAffirmationFromDB();
      setDailyAffirmation(affirmation);
      app.log.info(`Daily affirmation: ${affirmation}`);
    } catch (err) {
      app.log.error("Error fetching daily affirmation: ", err);
      setDailyAffirmation(AffirmationService.getFallbackAffirmation());
    }
  }

  // Schedule daily job
  cron.schedule("0 0 * * *", fetchDailyAffirmation);

  // Return the fetch function so it can be called immediately on startup
  return fetchDailyAffirmation;
}
