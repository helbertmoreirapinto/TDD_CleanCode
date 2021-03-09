import { InvalidParamError } from '../../errors'
import { Validator } from '.'

export class CompareFields implements Validator {
  private readonly field: string
  private readonly fieldToCompare: string

  constructor (field: string, fieldToCompare: string) {
    this.field = field
    this.fieldToCompare = fieldToCompare
  }

  async validate (input: any): Promise<Error> {
    if (input[this.field] !== input[this.fieldToCompare]) return new InvalidParamError(this.fieldToCompare)
  }
}
