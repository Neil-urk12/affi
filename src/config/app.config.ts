export const config = {
  port: process.env.PORT || 3002,
  environment: process.env.NODE_ENV || "development",
  cronSchedule: process.env.CRON_SCHEDULE || "0 0 * * *",
};
