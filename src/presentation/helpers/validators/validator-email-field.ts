import { Validator } from '.'
import { InvalidParamError } from '../../errors'
import { EmailValidator } from '../../protocols'

export class EmailField implements Validator {
  constructor (
    private readonly fieldEmail: string,
    private readonly emailValidator: EmailValidator
  ) {}

  async validate (input: any): Promise<Error> {
    const isValid = await this.emailValidator.isValid(input[this.fieldEmail])
    if (!isValid) return new InvalidParamError(this.fieldEmail)
  }
}
