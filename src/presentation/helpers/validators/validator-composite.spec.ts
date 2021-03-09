import { ValidateComposite, Validator } from '.'
import { MissingParamError } from '../../errors'

interface SutTypes {
  sut: ValidateComposite
}

const makeValidator = (): Validator => {
  class ValidatorStub implements Validator {
    async validate (input: string): Promise<Error> {
      return new MissingParamError('field')
    }
  }
  return new ValidatorStub()
}

const makeSut = (validators: Validator[]): SutTypes => {
  const sut = new ValidateComposite(validators)
  return {
    sut
  }
}

describe('Composite Validator', () => {
  test('Should return an error if any validation fails', async () => {
    const { sut } = makeSut([makeValidator()])
    const error = await sut.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })
})
