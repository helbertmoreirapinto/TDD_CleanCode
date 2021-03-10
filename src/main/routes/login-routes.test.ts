import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helpers'

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')
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
    test('', async () => {})
  })
})
