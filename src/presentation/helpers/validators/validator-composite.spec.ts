import { ValidateComposite, Validator } from '.'
import { MissingParamError } from '../../errors'

interface SutTypes {
  sut: ValidateComposite
  validatorStub: Validator
}

const makeValidator = (): Validator => {
  class ValidatorStub implements Validator {
    async validate (input: string): Promise<Error> {
      return null
    }
  }
  return new ValidatorStub()
}

const makeSut = (): SutTypes => {
  const validatorStub = makeValidator()
  const sut = new ValidateComposite([validatorStub])

  return {
    sut,
    validatorStub
  }
}

describe('Composite Validator', () => {
  test('Should return an error if any validation fails', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(new Promise(resolve => resolve(new MissingParamError('field'))))
    const error = await sut.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })
})
