import { DbLoadAccountByToken } from './db-load-account-by-token'
import { Decrypter } from '../../protocols/criptography/decrypter'

interface SutTypes{
  sut: DbLoadAccountByToken
  decryperStub: Decrypter
}

const makeDecryperStub = (): Decrypter => {
  class DecryperStub implements Decrypter {
    async decrypt (value: string): Promise<string> {
      return await new Promise(resolve => resolve('any_value'))
    }
  }
  return new DecryperStub()
}

const makeSut = (): SutTypes => {
  const decryperStub = makeDecryperStub()
  const sut = new DbLoadAccountByToken(decryperStub)

  return {
    sut,
    decryperStub
  }
}

describe('DbLoadAccountByToken Usecase', () => {
  test('Should call decrypter with correct values', async () => {
    const { sut, decryperStub } = makeSut()
    const decryptSpy = jest.spyOn(decryperStub, 'decrypt')
    await sut.loadByToken('any_token')
    expect(decryptSpy).toBeCalledWith('any_token')
  })
})
