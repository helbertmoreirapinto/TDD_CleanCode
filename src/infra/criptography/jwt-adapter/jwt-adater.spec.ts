import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adater'

const secretKey = 'secret'

// jest.mock('jwt', () => ({
//   async sign (value: string): Promise<string> {
//     return await new Promise(resolve => resolve('any_token'))
//   }
// }))

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
})
