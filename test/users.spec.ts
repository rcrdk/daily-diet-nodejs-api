import { it, beforeAll, afterAll, describe, expect, beforeEach } from 'vitest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'
import request from 'supertest'

describe('users routes', () => {
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

  it('should be able to create a new user', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'johndoe@doe.com',
      })
      .expect(201)
  })

  it('should be able to show a user', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@doe.com',
    })

    const cookies = createUserResponse.get('Set-Cookie') ?? []

    const getUserResponse = await request(app.server)
      .get('/users')
      .set('Cookie', cookies)
      .expect(200)

    expect(getUserResponse.body).toEqual(
      expect.objectContaining({
        name: 'John Doe',
        email: 'johndoe@doe.com',
      }),
    )
  })
})
