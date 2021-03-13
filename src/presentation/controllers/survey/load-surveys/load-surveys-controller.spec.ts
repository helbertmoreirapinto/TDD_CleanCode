import MockDate from 'mockdate'
import { HttpRequest, SurveyModel, LoadSurveys } from './load-surveys-controller-protocols'
import { LoadSurveysController } from './load-surveys-controller'

const makeFakeRequest = (): HttpRequest => ({
  headers: {},
  body: {}
})

const makeFakeSurvey = (): SurveyModel => ({
  id: 'any_id',
  question: 'any_question',
  answers: [
    { answer: 'any_answer1' },
    { answer: 'any_answer2' },
    { answer: 'any_answer3', image: 'any_image3' }
  ],
  date: new Date()
})

const makeFakeSurveys = (): SurveyModel[] => {
  const surveys: SurveyModel[] = []
  let amount: number = 5
  while (amount--) {
    surveys.push(makeFakeSurvey())
  }
  return surveys
}

interface SutTypes{
  sut: LoadSurveysController
  loadSurveysStub: LoadSurveys
}

const makeLoadSurveysStub = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return await new Promise(resolve => resolve(makeFakeSurveys()))
    }
  }
  return new LoadSurveysStub()
}

const makeSut = (): SutTypes => {
  const loadSurveysStub = makeLoadSurveysStub()
  const sut = new LoadSurveysController(loadSurveysStub)
  return {
    sut,
    loadSurveysStub
  }
}
describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveys with correct values', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysStub, 'load')

    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(loadSpy).toBeCalledWith()
  })
})
