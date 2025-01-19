import { FastifyInstance } from "fastify";
import { pool } from "../config/database";

export function setupGracefulShutdown(app: FastifyInstance) {
  const closeGracefully = async (signal: string) => {
    console.log(`Received signal to terminate: ${signal}`);
    await pool.end();
    await app.close();
    process.exit(0);
  };

  process.on("SIGINT", () => closeGracefully("SIGINT"));
  process.on("SIGTERM", () => closeGracefully("SIGTERM"));
}