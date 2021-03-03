import { EmailValidator } from '../presentation/controllers/singup/protocols/emailValidator'
import validator from 'validator'

export class EmailValidatorAdapter implements EmailValidator {
  async isValid (email: string): Promise<boolean> {
    return await new Promise(resolve => resolve(validator.isEmail(email)))
  }
}
