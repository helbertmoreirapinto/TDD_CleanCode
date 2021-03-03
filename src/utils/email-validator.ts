import { EmailValidator } from '../presentation/controllers/singup/protocols/emailValidator'
export class EmailValidatorAdapter implements EmailValidator {
  async isValid (email: string): Promise<boolean> {
    return await new Promise(resolve => resolve(false))
  }
}
