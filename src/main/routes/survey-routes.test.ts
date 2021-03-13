import { Collection } from 'mongodb'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helpers'
import request from 'supertest'
import app from '../config/app'
import { sign } from 'jsonwebtoken'
import env from '../config/env'

const makeFakeQuestion = (): any => ({
  question: 'Question',
  answers: [
    { answer: 'Answer 1', image: 'Image 1' },
    { answer: 'Answer 2' },
    { answer: 'Answer 3', image: 'Image 3' }
  ]
})

let surveyCollection: Collection
let accountCollection: Collection

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  test('Should return 403 on add survey without accesToken header', async () => {
    await request(app)
      .post('/api/add-survey')
      .send(makeFakeQuestion())
      .expect(403)
  })

  test('Should return 500 on add survey with invalid accesToken header', async () => {
    await request(app)
      .post('/api/add-survey')
      .set('x-access-token', 'any_token')
      .send(makeFakeQuestion())
      .expect(500)
  })

  test('Should return 403 on add survey with valid accesToken header user not admin', async () => {
    const res = await accountCollection.insertOne({
      name: 'any_value',
      email: 'any_email@email.com',
      password: 'hash_password'
    })
    const { _id: id } = res.ops[0]
    const accessToken = sign({ id }, env.jwtSecret)

    await accountCollection.updateOne({ _id: id }, { $set: { accessToken } })

    await request(app)
      .post('/api/add-survey')
      .set('x-access-token', accessToken)
      .send(makeFakeQuestion())
      .expect(403)
  })

  test('Should return 204 on add survey with valid accesToken header', async () => {
    const res = await accountCollection.insertOne({
      name: 'any_value',
      email: 'any_email@email.com',
      password: 'hash_password',
      role: 'admin'
    })
    const { _id: id } = res.ops[0]
    const accessToken = sign({ id }, env.jwtSecret)

    await accountCollection.updateOne({ _id: id }, { $set: { accessToken } })

    await request(app)
      .post('/api/add-survey')
      .set('x-access-token', accessToken)
      .send(makeFakeQuestion())
      .expect(204)
  })
})
