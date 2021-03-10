import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helpers'
import request from 'supertest'
import app from '../config/app'
import env from '../../main/config/env'

let accountCollection: Collection

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /signup', () => {
    test('Should return 200 on signup', async () => {
      await request(app)
        .post('/api/singup')
        .send({
          name: 'any_name',
          email: 'any_email@email.com',
          password: 'any_password',
          passwordConfirmation: 'any_password'

        })
        .expect(200)
    })
  })

  describe('POST /login', () => {
    test('Should return 200 on login if success', async () => {
      const password = await hash('any_password', env.salt)
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@email.com',
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'any_email@email.com',
          password: 'any_password'
        })
        .expect(200)
    })

    test('Should return 401 on login if fails', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'any_email@email.com',
          password: 'any_password'
        })
        .expect(401)
    })
  })
})
