import { AddSurveyController } from './add-survey-controller'
import { HttpRequest, Validator } from './add-survey-controller-protocols'
import { badRequest } from '../../../helpers/http/http-helpers'
import { MissingParamError } from '../../../errors'

interface SutTypes{
  sut: AddSurveyController
  validatorStub: Validator
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }]
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

const makeSut = (): SutTypes => {
  const validatorStub = makeValidatorStub()
  const sut = new AddSurveyController(validatorStub)

  return {
    sut,
    validatorStub
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
})
