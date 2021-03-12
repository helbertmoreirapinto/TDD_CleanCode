import { Collection } from 'mongodb'
import { SurveyMongoRepository } from './survey-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helpers'
import { AddSurveyModel } from '../../../../domain/usecases/add-survey'

interface SutTypes{
  sut: SurveyMongoRepository
}

const makeFakeAddSurvey = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [
    { answer: 'any_answer', image: 'any_image' },
    { answer: 'other_answer', image: 'other_image' }
  ]
})
const makeSut = (): SutTypes => {
  const sut = new SurveyMongoRepository()
  return {
    sut
  }
}

let surveyCollection: Collection
describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('survey')
    await surveyCollection.deleteMany({ })
  })

  test('Should return null on add success', async () => {
    const { sut } = makeSut()
    const account = await sut.add(makeFakeAddSurvey())
    expect(account).toBeFalsy()
  })
})
