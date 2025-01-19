import fastify from "fastify";
import { createDatabaseConnection } from "./config/database";
import affirmationRoutes from "../src/routes/affirmation";
import { setupDailyAffirmationJob } from "./jobs/dailyAffirmation";
import { setupGracefulShutdown } from "../src/utils/shutdown";
const cors = require("@fastify/cors");

declare module "fastify" {
  interface FastifyInstance {
    setDailyAffirmation: (affirmation: string) => void;
  }
}

const app = fastify({
  logger: true,
});

const PORT = 3002;

const start = async () => {
  try {
    // Initialize database connection
    await createDatabaseConnection();

    // Setup routes
    await app.register(affirmationRoutes);
    // Setup cron job
    const fetchDailyAffirmation = setupDailyAffirmationJob(
      app,
      app.setDailyAffirmation,
    );

    // Setup graceful shutdown
    setupGracefulShutdown(app);

    // Start server
    await app.listen({ port: PORT });

    // Fetch initial daily affirmation
    await fetchDailyAffirmation();
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();

app.get('/', async (request, reply) => {
  return {
    message: "You are wonderful. Don't forget to be kind to others!"
  }
})

app.register(cors, {
  origin: '*', 
  methods: ['GET'], 
  allowedHeaders: ['Content-Type'], 
})