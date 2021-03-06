import jwt from 'jsonwebtoken'
import env from '../../../main/config/env'
import { JwtAdapter } from './jwt-adater'

jest.mock('jsonwebtoken', () => ({
  async sign (value: string): Promise<string> {
    return await new Promise(resolve => resolve('any_token'))
  },
  async verify (value: string): Promise<string> {
    return await new Promise(resolve => resolve('any_id'))
  }
}))

interface SutTypes{
  sut: JwtAdapter
}

const makeSut = (): SutTypes => {
  const sut = new JwtAdapter(env.jwtSecret)
  return {
    sut
  }
}

describe('Jwt Adapter', () => {
  describe('function sign()', () => {
    test('Should call sign with correct values', async () => {
      const { sut } = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')
      await sut.encrypt('any_id')
      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, env.jwtSecret)
    })

    test('Should throws if sign throws', async () => {
      const { sut } = makeSut()
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => { throw new Error() })
      const accessTokenPromise = sut.encrypt('any_id')
      await expect(accessTokenPromise).rejects.toThrow()
    })

    test('Should return access token on sign success', async () => {
      const { sut } = makeSut()
      const accessToken = await sut.encrypt('any_id')
      expect(accessToken).toBe('any_token')
    })
  })

  describe('function verify()', () => {
    test('Should call decode with correct values', async () => {
      const { sut } = makeSut()
      const signSpy = jest.spyOn(jwt, 'verify')
      await sut.decrypt('any_token')
      expect(signSpy).toHaveBeenCalledWith('any_token', env.jwtSecret)
    })

    test('Should throws if verify throws', async () => {
      const { sut } = makeSut()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => { throw new Error() })
      const promise = sut.decrypt('any_token')
      await expect(promise).rejects.toThrow()
    })

    test('Should return id on verify success', async () => {
      const { sut } = makeSut()
      const value = await sut.decrypt('any_token')
      expect(value).toBe('any_id')
    })
  })
})
