import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adater'

const secretKey = 'secret'

jest.mock('jsonwebtoken', () => ({
  async sign (value: string): Promise<string> {
    return await new Promise(resolve => resolve('any_token'))
  }
}))

interface SutTypes{
  sut: JwtAdapter
}

const makeSut = (): SutTypes => {
  const sut = new JwtAdapter(secretKey)
  return {
    sut
  }
}

describe('Jwt Adapter', () => {
  test('Should call sign with correct values', async () => {
    const { sut } = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_id')
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, secretKey)
  })

  test('Should return access token on sign success', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.encrypt('any_id')
    expect(accessToken).toBe('any_token')
  })

  test('Should return access token on sign success', async () => {
    const { sut } = makeSut()
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error()
    })
    const accessTokenPromise = sut.encrypt('any_id')
    await expect(accessTokenPromise).rejects.toThrow()
  })
})