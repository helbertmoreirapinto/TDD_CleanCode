import { InvalidParamError, MissingParamError, Validator } from './validator-protocols'
import { ValidateComposite } from '.'

interface SutTypes {
  sut: ValidateComposite
  validatorStubs: Validator[]
}

const makeValidator = (): Validator => {
  class ValidatorStub implements Validator {
    async validate (input: string): Promise<Error> {
      return null
    }
  }
  return new ValidatorStub()
}

const makeSut = (numValidators: number): SutTypes => {
  const validatorStubs = []
  while (numValidators-- > 0) {
    validatorStubs.push(makeValidator())
  }
  const sut = new ValidateComposite(validatorStubs)

  return {
    sut,
    validatorStubs
  }
}

describe('Composite Validator', () => {
  test('Should return an error if any validation fails', async () => {
    const { sut, validatorStubs } = makeSut(3)
    jest.spyOn(validatorStubs[1], 'validate').mockReturnValueOnce(new Promise(resolve => resolve(new MissingParamError('field'))))

    const error = await sut.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should return the first error if more then one validation fails', async () => {
    const { sut, validatorStubs } = makeSut(3)
    jest.spyOn(validatorStubs[0], 'validate').mockReturnValueOnce(new Promise(resolve => resolve(new MissingParamError('field'))))
    jest.spyOn(validatorStubs[1], 'validate').mockReturnValueOnce(new Promise(resolve => resolve(new InvalidParamError('mock stack'))))
    jest.spyOn(validatorStubs[2], 'validate').mockReturnValueOnce(new Promise(resolve => resolve(new MissingParamError('otherField'))))

    const error = await sut.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should not return if validation succeeds', async () => {
    const { sut } = makeSut(3)

    const error = await sut.validate({ field: 'any_value' })
    expect(error).toBeFalsy()
  })
})
