import { DbAuthenticator } from './db-authenticator'
import { LoadAccountByEmailRepository, AccountModel, AuthenticatorModel, HashComparer } from './db-authenticator-protocols'

interface SutTypes {
  sut: DbAuthenticator
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashCompáreStub: HashComparer
}

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@email.com',
  password: 'hashed_password'
})

const makeFakeAuthenticator = (): AuthenticatorModel => ({
  email: 'any_email@email.com',
  password: 'any_password'
})

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel> {
      const account: AccountModel = makeFakeAccount()
      return await new Promise(resolve => resolve(account))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeHashCompáre = (): HashComparer => {
  class HashCompáreStub implements HashComparer {
    async compare (value: string, hashedValue: string): Promise<boolean> {
      return await new Promise(resolve => resolve(true))
    }
  }
  return new HashCompáreStub()
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const hashCompáreStub = makeHashCompáre()
  const sut = new DbAuthenticator(loadAccountByEmailRepositoryStub, hashCompáreStub)
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashCompáreStub
  }
}

describe('DbAuthenticator UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth(makeFakeAuthenticator())

    expect(loadSpy).toHaveBeenCalledWith('any_email@email.com')
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuthenticator())
    await expect(promise).rejects.toThrow()
  })

  test('Should retun null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(null)
    const accessToken = await sut.auth(makeFakeAuthenticator())
    expect(accessToken).toBeNull()
  })

  test('Should call HashComparer with correct password', async () => {
    const { sut, hashCompáreStub } = makeSut()
    const compareSpy = jest.spyOn(hashCompáreStub, 'compare')

    await sut.auth(makeFakeAuthenticator())
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })
})
