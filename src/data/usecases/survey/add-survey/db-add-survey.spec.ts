import { SurveyModel, AddSurveyModel, AddSurveyRepository } from './db-add-survey-protocols'
import { DbAddSurvey } from './db-add-survey'
interface SutTpes{
  sut: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}

const makeFakeAddSurvey = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [
    { answer: 'any_answer', image: 'any_image' },
    { answer: 'other_answer' }
  ],
  date: new Date()
})

const makeAddSurveyRepositoryStub = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (surveyData: SurveyModel): Promise<void> {
      return await new Promise(resolve => resolve(null))
    }
  }
  return new AddSurveyRepositoryStub()
}

const makeSut = (): SutTpes => {
  const addSurveyRepositoryStub = makeAddSurveyRepositoryStub()
  const sut = new DbAddSurvey(addSurveyRepositoryStub)
  return {
    sut,
    addSurveyRepositoryStub
  }
}

describe('DbAddSurvey Usecases', () => {
  test('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    const surveyData = makeFakeAddSurvey()
    await sut.add(surveyData)
    expect(addSpy).toHaveBeenCalledWith(surveyData)
  })

  test('Should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    jest.spyOn(addSurveyRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.add(makeFakeAddSurvey())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null when succeeds', async () => {
    const { sut } = makeSut()
    const survey = await sut.add(makeFakeAddSurvey())
    expect(survey).toBeFalsy()
  })
})
