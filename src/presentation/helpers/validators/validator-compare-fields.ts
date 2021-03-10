import { InvalidParamError } from '../../errors'
import { Validator } from '.'

export class CompareFields implements Validator {
  constructor (
    private readonly field: string,
    private readonly fieldToCompare: string
  ) {}

  async validate (input: any): Promise<Error> {
    if (input[this.field] !== input[this.fieldToCompare]) return new InvalidParamError(this.fieldToCompare)
  }
}
