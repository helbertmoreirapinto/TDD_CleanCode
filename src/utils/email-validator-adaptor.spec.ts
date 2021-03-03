import { EmailValidatorAdapter } from './email-validator'
describe('EmailValidator Adapter', () => {
  test('Shout retun false if validator returns false', async () => {
    const sut = new EmailValidatorAdapter()
    const isValid = await sut.isValid('invalid_email@email.com')
    expect(isValid).toBe(false)
  })
})
