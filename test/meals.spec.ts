import { it, beforeAll, afterAll, describe, expect, beforeEach } from 'vitest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'
import request from 'supertest'

describe('meals routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex -- migrate:rollback --all')
    execSync('npm run knex -- migrate:latest')
  })

  it('should be able to create a meal', async () => {
    const createUserResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'johndoe@doe.com',
      })
      .expect(201)

    const cookies = createUserResponse.get('Set-Cookie') ?? []

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Pizza',
        description: 'Cheese and pepper',
        isOnDiet: true,
        eatedAt: '2024-08-28 18:00:00',
      })
      .expect(201)
  })

  it('should be able to list all meals', async () => {
    const createUserResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'johndoe@doe.com',
      })
      .expect(201)

    const cookies = createUserResponse.get('Set-Cookie') ?? []

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Pizza',
        description: 'Cheese and pepper',
        isOnDiet: true,
        eatedAt: '2024-08-28 18:00:00',
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Hamburguer',
        description: 'Bacon',
        isOnDiet: false,
        eatedAt: '2024-08-29 18:00:00',
      })
      .expect(201)

    const getMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    expect(getMealsResponse.body.meals).toEqual([
      expect.objectContaining({
        name: 'Hamburguer',
        description: 'Bacon',
        is_on_diet: 0,
        eated_at: 1724965200000,
      }),
      expect.objectContaining({
        name: 'Pizza',
        description: 'Cheese and pepper',
        is_on_diet: 1,
        eated_at: 1724878800000,
      }),
    ])
  })

  it('should be able to get a meal', async () => {
    const createUserResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'johndoe@doe.com',
      })
      .expect(201)

    const cookies = createUserResponse.get('Set-Cookie') ?? []

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Pizza',
        description: 'Cheese and pepper',
        isOnDiet: true,
        eatedAt: '2024-08-28 18:00:00',
      })
      .expect(201)

    const getMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const { id } = getMealsResponse.body.meals.at(0)

    const getMealResponse = await request(app.server)
      .get(`/meals/${id}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(getMealResponse.body).toEqual(
      expect.objectContaining({
        name: 'Pizza',
        description: 'Cheese and pepper',
        is_on_diet: 1,
        eated_at: 1724878800000,
      }),
    )
  })

  it('should be able to delete a meal', async () => {
    const createUserResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'johndoe@doe.com',
      })
      .expect(201)

    const cookies = createUserResponse.get('Set-Cookie') ?? []

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Pizza',
        description: 'Cheese and pepper',
        isOnDiet: true,
        eatedAt: '2024-08-28 18:00:00',
      })
      .expect(201)

    const getMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const { id } = getMealsResponse.body.meals.at(0)

    await request(app.server)
      .delete(`/meals/${id}`)
      .set('Cookie', cookies)
      .expect(204)
  })

  it('should be able to update a meal', async () => {
    const createUserResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'johndoe@doe.com',
      })
      .expect(201)

    const cookies = createUserResponse.get('Set-Cookie') ?? []

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Pizza',
        description: 'Cheese and pepper',
        isOnDiet: true,
        eatedAt: '2024-08-28 18:00:00',
      })
      .expect(201)

    const getMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const { id } = getMealsResponse.body.meals.at(0)

    await request(app.server)
      .put(`/meals/${id}`)
      .set('Cookie', cookies)
      .send({
        name: 'Hamburguer',
        description: 'I love to change!',
        isOnDiet: false,
        eatedAt: '2024-10-16 18:00:00',
      })
      .expect(204)

    const getUpdatedMealResponse = await request(app.server)
      .get(`/meals/${id}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(getUpdatedMealResponse.body).toEqual(
      expect.objectContaining({
        name: 'Hamburguer',
        description: 'I love to change!',
        is_on_diet: 0,
        eated_at: 1729112400000,
      }),
    )
  })

  it('should be able to get summary of meals', async () => {
    const createUserResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'johndoe@doe.com',
      })
      .expect(201)

    const cookies = createUserResponse.get('Set-Cookie') ?? []

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Pizza',
        description: 'Cheese and bacon',
        isOnDiet: false,
        eatedAt: '2024-08-28 18:00:00',
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Rice and Beans',
        description: 'Soooo goood!',
        isOnDiet: true,
        eatedAt: '2024-08-29 18:00:00',
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Coffee and Bananas',
        description: 'Soooo goood to wake up!',
        isOnDiet: true,
        eatedAt: '2024-08-30 18:00:00',
      })
      .expect(201)

    const getMealsSummaryResponse = await request(app.server)
      .get('/meals/summary')
      .set('Cookie', cookies)
      .expect(200)

    expect(getMealsSummaryResponse.body).toEqual({
      totalMeals: 3,
      totalMealsInDiet: 2,
      totalMealsOutOfDiet: 1,
      betterSequenceInDiet: 2,
    })
  })
})
