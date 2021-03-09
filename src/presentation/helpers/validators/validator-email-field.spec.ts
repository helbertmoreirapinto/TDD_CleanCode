import { EmailField } from '.'
import { InvalidParamError } from '../../errors/'
import { EmailValidator } from '../../protocols'

interface SutTypes {
  sut: EmailField
  emailValidatorStub: EmailValidator
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    async isValid (email: string): Promise<boolean> {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new EmailField('email', emailValidatorStub)

  return {
    sut,
    emailValidatorStub
  }
}

describe('Email Validator', () => {
  test('Should return an error if EmailValidator returns false', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(new Promise(resolve => resolve(false)))

    const error = await sut.validate({ email: 'any_email@email.com' })
    expect(error).toEqual(new InvalidParamError('email'))
  })

  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    await sut.validate({ email: 'any_email@email.com' })
    expect(isValidSpy).toHaveBeenLastCalledWith('any_email@email.com')
  })

  test('Should throw if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(async () => {
      throw new Error()
    })

    const errorPromise = sut.validate({ email: 'any_email@email.com' })

    await expect(errorPromise).rejects.toThrow()
  })
})
