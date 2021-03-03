import bcrypt from 'bcrypt'
import { BCryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('mock_hash'))
  }
}))

describe('BCrypt Adapter', () => {
  test('Shold call bcrypt with correct values', async () => {
    const salt = 12
    const sut = new BCryptAdapter(salt)
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Shold return a hash on success', async () => {
    const salt = 12
    const sut = new BCryptAdapter(salt)
    const hash = await sut.encrypt('any_value')
    expect(hash).toBe('mock_hash')
  })
})
