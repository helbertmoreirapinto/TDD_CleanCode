import { SingUpController } from './singup-controller'
import { HttpRequest, AddAccount, AddAccountModel, AccountModel, Validator, Authenticator, AuthenticatorModel } from './singup-controller-protocols'
import { badRequest, internalServerError, ok } from '../../helpers/http/http-helpers'
import { MissingParamError, InternalServerError } from '../../errors'

interface SutTypes {
  sut: SingUpController
  addAccountStub: AddAccount
  validatorStub: Validator
  authenticatorStub: Authenticator
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@email.com',
  password: 'valid_password'
})

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const makeAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return await new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new AddAccountStub()
}

const makeValidatorStub = (): Validator => {
  class ValidatorStub implements Validator {
    async validate (data: any): Promise<Error> {
      return null
    }
  }
  return new ValidatorStub()
}

const makeAuthenticator = (): Authenticator => {
  class AuthenticatorStub implements Authenticator {
    async auth (authData: AuthenticatorModel): Promise<string> {
      return await new Promise(resolve => resolve('any_token'))
    }
  }
  return new AuthenticatorStub()
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAccount()
  const validatorStub = makeValidatorStub()
  const authenticatorStub = makeAuthenticator()
  const sut = new SingUpController(addAccountStub, validatorStub, authenticatorStub)

  return {
    sut,
    addAccountStub,
    validatorStub,
    authenticatorStub
  }
}

describe('SingUp Controller', () => {
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

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')

    await sut.handle(makeFakeRequest())
    expect(addSpy).toHaveBeenLastCalledWith({
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
    })
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => { reject(new Error()) })
    })

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(internalServerError(new InternalServerError('mock stack')))
  })

  test('Should call Authenticator with correct values', async () => {
    const { sut, authenticatorStub } = makeSut()
    const authSpy = jest.spyOn(authenticatorStub, 'auth')

    await sut.handle(makeFakeRequest())
    expect(authSpy).toHaveBeenLastCalledWith({
      email: 'any_email@email.com',
      password: 'any_password'
    })
  })

  test('Should return 500 if Authenticator throws', async () => {
    const { sut, authenticatorStub } = makeSut()
    jest.spyOn(authenticatorStub, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const hhtpResponse = await sut.handle(makeFakeRequest())
    expect(hhtpResponse).toEqual(internalServerError(new Error()))
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ acessToken: 'any_token' }))
  })
})
