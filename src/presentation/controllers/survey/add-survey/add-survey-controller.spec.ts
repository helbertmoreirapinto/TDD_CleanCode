import { AddSurveyController } from './add-survey-controller'
import { HttpRequest, Validator, AddSurvey, AddSurveyModel } from './add-survey-controller-protocols'
import { badRequest, internalServerError } from '../../../helpers/http/http-helpers'
import { MissingParamError } from '../../../errors'

interface SutTypes{
  sut: AddSurveyController
  validatorStub: Validator
  addSurveyStub: AddSurvey
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [
      { image: 'any_image', answer: 'any_answer' },
      { image: 'other_image', answer: 'other_answer' }
    ]
  }
})

const makeValidatorStub = (): Validator => {
  class ValidatorStub implements Validator {
    async validate (data: any): Promise<Error> {
      return await new Promise(resolve => resolve(null))
    }
  }
  return new ValidatorStub()
}

const makeAddSurveyStub = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (survey: AddSurveyModel): Promise<void> {
      return await new Promise(resolve => resolve(null))
    }
  }
  return new AddSurveyStub()
}

const makeSut = (): SutTypes => {
  const validatorStub = makeValidatorStub()
  const addSurveyStub = makeAddSurveyStub()
  const sut = new AddSurveyController(validatorStub, addSurveyStub)

  return {
    sut,
    validatorStub,
    addSurveyStub
  }
}

describe('Add Survey Controller', () => {
  test('Should call Validation with correct values', async () => {
    const { sut, validatorStub } = makeSut()
    const validatorSpy = jest.spyOn(validatorStub, 'validate')
    const httpRequest: HttpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validatorSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validator returns an error', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(new Promise(resolve => resolve(new MissingParamError('any_field'))))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })

  test('Should call AddSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyStub, 'add')
    const httpRequest: HttpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 500 if AddSurvey returns an error', async () => {
    const { sut, addSurveyStub } = makeSut()
    jest.spyOn(addSurveyStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const hhtpResponse = await sut.handle(makeFakeRequest())
    expect(hhtpResponse).toEqual(internalServerError(new Error()))
  })
})
