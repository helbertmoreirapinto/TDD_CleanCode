import { Validator } from '.'
import { InvalidParamError } from '../../errors'
import { EmailValidator } from '../../protocols'

export class EmailField implements Validator {
  private readonly fieldEmail: string
  private readonly emailValidator: EmailValidator

  constructor (fieldEmail: string, emailValidator: EmailValidator) {
    this.fieldEmail = fieldEmail
    this.emailValidator = emailValidator
  }

  async validate (input: any): Promise<Error> {
    const isValid = await this.emailValidator.isValid(input[this.fieldEmail])
    if (!isValid) return new InvalidParamError(this.fieldEmail)
  }
}
