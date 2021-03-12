import { DbLoadAccountByToken } from './db-load-account-by-token'
import { Decrypter } from '../../protocols/criptography/decrypter'
import { LoadAccountByAccessTokenRepository } from '../../../data/protocols/db/account/load-account-by-access-token-repository'
import { AccountModel } from '../add-account/db-add-account-protocols'

interface SutTypes{
  sut: DbLoadAccountByToken
  decryperStub: Decrypter
  loadAccountByAccessTokenRepositoryStub: LoadAccountByAccessTokenRepository
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
const makeLoadAccountByAccessTokenRepositoryStub = (): LoadAccountByAccessTokenRepository => {
  class LoadAccountByAccessTokenRepositoryStub implements LoadAccountByAccessTokenRepository {
    async loadByAccessToken (accessToken: string): Promise<AccountModel> {
      return await new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new LoadAccountByAccessTokenRepositoryStub()
}
const makeSut = (): SutTypes => {
  const decryperStub = makeDecryperStub()
  const loadAccountByAccessTokenRepositoryStub = makeLoadAccountByAccessTokenRepositoryStub()
  const sut = new DbLoadAccountByToken(decryperStub, loadAccountByAccessTokenRepositoryStub)

  return {
    sut,
    decryperStub,
    loadAccountByAccessTokenRepositoryStub
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
    const { sut, loadAccountByAccessTokenRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByAccessTokenRepositoryStub, 'loadByAccessToken')
    await sut.loadByToken('any_token')
    expect(loadSpy).toBeCalledWith('any_value')
  })
})
