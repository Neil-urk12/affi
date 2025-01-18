import Fastify from 'fastify'
import fastifySchedule from '@fastify/schedule'

const fastify = Fastify({
  logger: true
})

const PORT = 3002

fastify.get('/', async (req, rep) => {
    return {
        message: "Toma ligma!"
    }
})

fastify.route({
    method: 'GET',
    url: '/affirmation/:id',
    schema: {
        params: {
            type: 'object',
            properties: {
                id: { type: 'string' }
            },
            required: ['id']
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    message: { type: 'string'}
                },
                required: ['message']
            }
        }
    },
    handler: async (req, rep) => {
        const { id } = req.params as { id: string }
        return {
            // message: "You are awesome!"
            message: `You are awesome! ${id}`
        }
    },
})

try {
    fastify.listen({ port: PORT })
} catch (error) {
    fastify.log.error(error)
    process.exit(1)
}