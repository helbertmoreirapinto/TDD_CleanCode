import { Collection } from 'mongodb'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helpers'
import request from 'supertest'
import app from '../config/app'

let surveyCollection: Collection

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
  })

  test('Should return 403 if user not permission', async () => {
    await request(app)
      .post('/api/add-survey')
      .send({
        question: 'Question',
        answers: [
          { answer: 'Answer 1', image: 'Image 1' },
          { answer: 'Answer 2' },
          { answer: 'Answer 3', image: 'Image 3' }
        ]
      })
      .expect(403)
  })
})
