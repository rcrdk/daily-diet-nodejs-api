import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'
import { checkUserAuthenticated } from '../middlewares/check-user-authenticated'

export async function usersRoutes(app: FastifyInstance) {
  app.get(
    '/',
    { preHandler: [checkUserAuthenticated] },
    async (request, reply) => {
      const { sessionId } = request.cookies

      const user = await knex('users').where('session_id', sessionId).first()

      if (!user) {
        return reply.status(404).send({ error: 'User not found' })
      }

      return reply.status(200).send(user)
    },
  )

  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
    })

    const { name, email } = createUserBodySchema.parse(request.body)

    let { sessionId } = request.cookies

    if (!sessionId) {
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    const checkUserEmail = await knex('users').where('email', email).first()

    if (checkUserEmail) {
      return reply.status(400).send({ error: 'User e-mail already in use' })
    }

    await knex('users').insert({
      id: randomUUID(),
      session_id: sessionId,
      name,
      email,
    })

    return reply.status(201).send()
  })
}
