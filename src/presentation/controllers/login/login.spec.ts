import { LoginController } from './login'
import { HttpRequest, EmailValidator, Authenticator, Validator } from './login-protocols'
import { badRequest, internalServerError, unauthorized, ok } from '../../helpers/http-helpers'
import { MissingParamError } from '../../errors'

interface SutTypes {
  sut: LoginController
  emailValidatorStub: EmailValidator
  authenticatorStub: Authenticator
  validatorStub: Validator
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@email.com',
    password: 'any_password'
  }
})

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    async isValid (email: string): Promise<boolean> {
      return await new Promise(resolve => resolve(true))
    }
  }

  return new EmailValidatorStub()
}

const makeAuthenticator = (): Authenticator => {
  class AuthenticatorStub implements Authenticator {
    async auth (email: string, password: string): Promise<string> {
      return await new Promise(resolve => resolve('valid_token'))
    }
  }
  return new AuthenticatorStub()
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
  const emailValidatorStub = makeEmailValidator()
  const authenticatorStub = makeAuthenticator()
  const validatorStub = makeValidator()
  const sut = new LoginController(emailValidatorStub, authenticatorStub, validatorStub)

  return {
    sut,
    emailValidatorStub,
    authenticatorStub,
    validatorStub
  }
}

describe('Login Controller', () => {
  test('Should call Validator with correct value', async () => {
    const { sut, validatorStub } = makeSut()
    const validateSpy = jest.spyOn(validatorStub, 'validate')

    const httpResquest = makeFakeRequest()
    await sut.handle(httpResquest)
    expect(validateSpy).toHaveBeenLastCalledWith(httpResquest.body)
  })

  test('Should return 400 if Validator returns an error', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(new Promise((resolve, reject) => resolve(new MissingParamError('any_field'))))

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })

  test('Should call Authenticator with correct values', async () => {
    const { sut, authenticatorStub } = makeSut()
    const authSpy = jest.spyOn(authenticatorStub, 'auth')

    await sut.handle(makeFakeRequest())
    expect(authSpy).toHaveBeenLastCalledWith('any_email@email.com', 'any_password')
  })

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticatorStub } = makeSut()
    jest.spyOn(authenticatorStub, 'auth').mockReturnValueOnce(new Promise(resolve => resolve(null)))

    const hhtpResponse = await sut.handle(makeFakeRequest())
    expect(hhtpResponse).toEqual(unauthorized())
  })

  test('Should return 200 if Authenticator throws', async () => {
    const { sut, authenticatorStub } = makeSut()
    jest.spyOn(authenticatorStub, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const hhtpResponse = await sut.handle(makeFakeRequest())
    expect(hhtpResponse).toEqual(internalServerError(new Error()))
  })

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut } = makeSut()

    const hhtpResponse = await sut.handle(makeFakeRequest())
    expect(hhtpResponse).toEqual(ok({
      accessToken: 'valid_token'
    }))
  })
})
