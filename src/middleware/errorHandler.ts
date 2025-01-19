import { FastifyError, FastifyReply, FastifyRequest } from "fastify";

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  request.log.error(error);

  // Determine if error is operational or programming
  const isOperationalError = error.statusCode !== undefined;

  if (isOperationalError) {
    reply.status(error.statusCode || 500).send({
      error: error.message,
    });
  } else {
    // Programming error - don't leak error details
    reply.status(500).send({
      error: "An unexpected error occurred",
    });
  }
}
