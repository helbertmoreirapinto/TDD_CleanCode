import { MissingParamError } from '../../errors'
import { Validator } from '.'

export class RequiredFields implements Validator {
  constructor (private readonly fieldName: string) {}

  async validate (input: any): Promise<Error> {
    if (!input[this.fieldName]) return new MissingParamError(this.fieldName)
  }
}
