import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

const affirmationRoutes = async (fastify: FastifyInstance) => {
  let dailyAffirmation: string;

  fastify.get("/daily-affirmation", async (request, reply) => {
    return {
      message: dailyAffirmation,
    };
  });

  // Attach the setter to the fastify instance
  fastify.decorate("setDailyAffirmation", (affirmation: string) => {
    dailyAffirmation = affirmation;
  });
};

export default fp(affirmationRoutes, {
  name: "affirmation-routes",
});

// export default async function affirmationRoutes(
//   fastify: FastifyInstance,
//   options: any,
// ) {
//   let dailyAffirmation: string;

//   fastify.get("/daily-affirmation", async (request, reply) => {
//     return {
//       message: dailyAffirmation,
//     };
//   });

//   // Expose setter for daily affirmation
//   return {
//     setDailyAffirmation: (affirmation: string) => {
//       dailyAffirmation = affirmation;
//     },
//   };
// }
