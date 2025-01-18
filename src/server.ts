import fastify from "fastify";
const cron = require('node-cron')
import sampleData from "./data/sampleAffirmations.json";

const app = fastify({
  logger: true,
})

const PORT = 3002

let dailyAffirmation = sampleData.affirmations[0]

cron.schedule("0 0 * * *", () => {
  fetchDailyAffirmation();
});

function fetchDailyAffirmation() {
  try {
    dailyAffirmation =
      sampleData.affirmations[
        Math.floor(Math.random() * sampleData.affirmations.length)
      ];
    app.log.info(`Daily affirmation: ${dailyAffirmation}`);
  } catch (err) {
    app.log.error("Error fetching daily affirmation: ", err);
    dailyAffirmation =
      sampleData.affirmations[
        Math.floor(Math.random() * sampleData.affirmations.length)
      ];
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
    } catch (error) {
        app.log.error(error);
        process.exit(1);
    }
}
  
start()