import { FastifyInstance } from 'fastify'
import { checkUserAuthenticated } from '../middlewares/check-user-authenticated'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'

export async function mealsRoutes(app: FastifyInstance) {
  app.get(
    '/',
    { preHandler: [checkUserAuthenticated] },
    async (request, reply) => {
      const meals = await knex('meals')
        .where('user_id', request.user?.id)
        .orderBy('eated_at', 'desc')

      return reply.send({ meals })
    },
  )

  app.get(
    '/:id',
    { preHandler: [checkUserAuthenticated] },
    async (request, reply) => {
      const getMealParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getMealParamsSchema.parse(request.params)

      const meal = await knex('meals')
        .where({ id, user_id: request.user?.id })
        .first()

      if (!meal) {
        return reply.status(404).send({ error: 'Meal not found' })
      }

      return reply.send(meal)
    },
  )

  app.post(
    '/',
    { preHandler: [checkUserAuthenticated] },
    async (request, reply) => {
      const createMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        isOnDiet: z.boolean(),
        eatedAt: z.coerce.date(),
      })

      const { name, description, isOnDiet, eatedAt } =
        createMealBodySchema.parse(request.body)

      await knex('meals').insert({
        id: randomUUID(),
        name,
        description,
        is_on_diet: isOnDiet,
        eated_at: eatedAt.getTime(),
        user_id: request.user?.id,
      })

      return reply.status(201).send()
    },
  )

  app.put(
    '/:id',
    { preHandler: [checkUserAuthenticated] },
    async (request, reply) => {
      const getMealParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getMealParamsSchema.parse(request.params)

      const createMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        isOnDiet: z.boolean(),
        eatedAt: z.coerce.date(),
      })

      const { name, description, isOnDiet, eatedAt } =
        createMealBodySchema.parse(request.body)

      const meal = await knex('meals')
        .where({ id, user_id: request.user?.id })
        .first()

      if (!meal) {
        return reply.status(404).send({ error: 'Meal not found' })
      }

      await knex('meals')
        .where({ id, user_id: request.user?.id })
        .update({
          name,
          description,
          is_on_diet: isOnDiet,
          eated_at: eatedAt.getTime(),
          updated_at: new Date()
            .toISOString()
            .replace('T', ' ')
            .split('.')
            .at(0),
        })

      return reply.status(204).send()
    },
  )

  app.delete(
    '/:id',
    { preHandler: [checkUserAuthenticated] },
    async (request, reply) => {
      const getMealParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getMealParamsSchema.parse(request.params)

      const meal = await knex('meals')
        .where({ id, user_id: request.user?.id })
        .first()

      if (!meal) {
        return reply.status(404).send({ error: 'Meal not found' })
      }

      await knex('meals').where({ id, user_id: request.user?.id }).delete()

      return reply.status(204).send()
    },
  )

  app.get(
    '/summary',
    { preHandler: [checkUserAuthenticated] },
    async (request, reply) => {
      const totalMeals = await knex('meals').where({
        user_id: request.user?.id,
      })

      const totalMealsInDiet = await knex('meals')
        .where({ user_id: request.user?.id, is_on_diet: true })
        .count('id', { as: 'count' })
        .first()

      const totalMealsOutOfDiet = await knex('meals')
        .where({ user_id: request.user?.id, is_on_diet: false })
        .count('id', { as: 'count' })
        .first()

      const { betterSequenceInDiet } = totalMeals.reduce(
        (acc, meal) => {
          if (meal.is_on_diet) {
            acc.currentSequence += 1
          } else {
            acc.currentSequence = 0
          }

          if (acc.currentSequence > acc.betterSequenceInDiet) {
            acc.betterSequenceInDiet = acc.currentSequence
          }

          return acc
        },
        { betterSequenceInDiet: 0, currentSequence: 0 },
      )

      reply.status(200).send({
        totalMeals: totalMeals.length,
        totalMealsInDiet: totalMealsInDiet?.count,
        totalMealsOutOfDiet: totalMealsOutOfDiet?.count,
        betterSequenceInDiet,
      })
    },
  )
}
