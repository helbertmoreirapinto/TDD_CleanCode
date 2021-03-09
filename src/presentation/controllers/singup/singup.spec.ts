import { AddAccount, AddAccountModel, AccountModel, Validator } from './singup-protocols'
import { SingUpController } from './singup'
import { MissingParamError, InternalServerError } from '../../errors/'
import { HttpRequest } from '../../protocols'
import { badRequest, internalServerError, ok } from '../../helpers/http-helpers'

interface SutTypes {
  sut: SingUpController
  addAccountStub: AddAccount
  validatorStub: Validator
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

const makeSut = (): SutTypes => {
  const addAccountStub = makeAccount()
  const validatorStub = makeValidatorStub()
  const sut = new SingUpController(addAccountStub, validatorStub)

  return {
    sut,
    addAccountStub,
    validatorStub
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

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })
})
