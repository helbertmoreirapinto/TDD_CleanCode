import { EmailValidator } from '../presentation/protocols/emailValidator'
import validator from 'validator'

export class EmailValidatorAdapter implements EmailValidator {
  async isValid (email: string): Promise<boolean> {
    return await new Promise(resolve => resolve(validator.isEmail(email)))
  }
}
