import { EmailValidatorAdapter } from './email-validator'
import validator from 'validator'

jest.mock('validator', () => ({
  async isEmail (): Promise<boolean> {
    return await new Promise(resolve => resolve(true))
  }
}))

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

describe('EmailValidator Adapter', () => {
  test('Shout retun false if validator returns false', async () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = await sut.isValid('invalid_email@email.com')
    expect(isValid).toBe(false)
  })

  test('Shout retun true if validator returns true', async () => {
    const sut = makeSut()
    const isValid = await sut.isValid('valid_email@email.com')
    expect(isValid).toBe(true)
  })

  test('Shout call validator with correct email', async () => {
    const sut = makeSut()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    await sut.isValid('any_email@email.com')
    expect(isEmailSpy).toHaveBeenCalledWith('any_email@email.com')
  })
})
