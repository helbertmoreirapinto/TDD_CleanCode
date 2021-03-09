import { MissingParamError } from '../../errors'
import { Validator } from '.'

export class RequiredFields implements Validator {
  private readonly fieldName: string
  constructor (fieldName: string) {
    this.fieldName = fieldName
  }

  async validate (input: any): Promise<Error> {
    if (!input[this.fieldName]) return new MissingParamError(this.fieldName)
  }
}
