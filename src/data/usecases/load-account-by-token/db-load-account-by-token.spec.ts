import { DbLoadAccountByToken } from './db-load-account-by-token'
import { Decrypter } from '../../protocols/criptography/decrypter'
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository'
import { AccountModel } from '../add-account/db-add-account-protocols'

interface SutTypes{
  sut: DbLoadAccountByToken
  decryperStub: Decrypter
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
}

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@email.com',
  password: 'hash_password',
  accessToken: 'any_token'
})

const makeDecryperStub = (): Decrypter => {
  class DecryperStub implements Decrypter {
    async decrypt (value: string): Promise<string> {
      return await new Promise(resolve => resolve('any_value'))
    }
  }
  return new DecryperStub()
}
const makeLoadAccountByTokenRepositoryStub = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (token: string): Promise<AccountModel> {
      return await new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}
const makeSut = (): SutTypes => {
  const decryperStub = makeDecryperStub()
  const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepositoryStub()
  const sut = new DbLoadAccountByToken(decryperStub, loadAccountByTokenRepositoryStub)

  return {
    sut,
    decryperStub,
    loadAccountByTokenRepositoryStub
  }
}

describe('DbLoadAccountByToken Usecase', () => {
  test('Should call Decrypter with correct values', async () => {
    const { sut, decryperStub } = makeSut()
    const decryptSpy = jest.spyOn(decryperStub, 'decrypt')
    await sut.loadByToken('any_token')
    expect(decryptSpy).toBeCalledWith('any_token')
  })

  test('Should thorw if Decrypter throws', async () => {
    const { sut, decryperStub } = makeSut()
    jest.spyOn(decryperStub, 'decrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.loadByToken('any_token')
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if Decrypter fails', async () => {
    const { sut, decryperStub } = makeSut()
    jest.spyOn(decryperStub, 'decrypt').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const account = await sut.loadByToken('any_token')
    expect(account).toBeFalsy()
  })

  test('Should call LoadAccountRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
    await sut.loadByToken('any_token')
    expect(loadSpy).toBeCalledWith('any_value')
  })

  test('Should thorw if LoadAccountRepository throws', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.loadByToken('any_token')
    await expect(promise).rejects.toThrow()
  })
})
