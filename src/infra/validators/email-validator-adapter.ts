
import validator from 'validator'
import { EmailValidator } from '../../validation/protocols/emailValidator'

export class EmailValidatorAdapter implements EmailValidator {
  async isValid (email: string): Promise<boolean> {
    return await new Promise(resolve => resolve(validator.isEmail(email)))
  }
}
