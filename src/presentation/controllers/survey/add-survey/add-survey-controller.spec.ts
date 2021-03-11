import { HttpRequest, Validator } from '../../../protocols'
import { AddSurveyController } from './add-survey-controller'

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
})
