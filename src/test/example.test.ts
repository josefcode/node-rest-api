import { expect, test, describe, beforeAll, afterAll, beforeEach } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../app'

describe('render api', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })
  test('create a transaction', async () => {
    await request(app.server)
      .post('/user')
      .send({
        title: 'Transfer money',
        amount: 100,
        type: 'credit',
      })
      .expect(201)
  })

  test('list transactions', async () => {
    const createTransaction = await request(app.server).post('/user').send({
      title: 'atef chelaghma',
      amount: 100,
      type: 'credit',
    })

    const cookie = createTransaction.get('Set-Cookie')

    const respostGet = await request(app.server)
      .get('/user')
      .set('Cookie', cookie)
      .expect(200)

    expect(respostGet.body.transactions).toEqual([
      expect.objectContaining({
        title: 'atef chelaghma',
        amount: 100,
      }),
    ])
  })

  test('list transactions by id', async () => {
    const createTransaction = await request(app.server).post('/user').send({
      title: 'atef chelaghma',
      amount: 100,
      type: 'credit',
    })

    const cookie = createTransaction.get('Set-Cookie')

    const respostGet = await request(app.server)
      .get('/user')
      .set('Cookie', cookie)
      .expect(200)

    const id = respostGet.body.transactions[0].id

    const createTransactionById = await request(app.server)
      .get(`/user/${id}`)
      .set('Cookie', cookie)
      .expect(200)

    expect(createTransactionById.body.transaction).toEqual(
      expect.objectContaining({
        title: 'atef chelaghma',
        amount: 100,
      }),
    )
  })

  test('list transactions summary', async () => {
    const createFirstTransaction = await request(app.server)
      .post('/user')
      .send({
        title: 'credit transaction',
        amount: 3000,
        type: 'credit',
      })

    const cookie = createFirstTransaction.get('Set-Cookie')

    await request(app.server).post('/user').set('Cookie', cookie).send({
      title: 'debit transaction',
      amount: 1000,
      type: 'debit',
    })

    const summary = await request(app.server)
      .get('/user/summary')
      .set('Cookie', cookie)
      .expect(200)

    expect(summary.body.summary).toEqual({
      amount: 2000,
    })
  })
})
