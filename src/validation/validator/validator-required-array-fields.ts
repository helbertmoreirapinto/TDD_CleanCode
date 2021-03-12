import { InvalidParamError } from '../../presentation/errors'
import { MissingParamError, Validator } from './validator-protocols'

export class RequiredArrayFields implements Validator {
  constructor (
    private readonly arrayFieldName: string,
    private readonly fieldName: string
  ) {}

  async validate (input: any): Promise<Error> {
    const arrayField = input[this.arrayFieldName]
    if (!arrayField) return new MissingParamError(this.arrayFieldName)
    if (!arrayField.length) return new InvalidParamError(this.arrayFieldName)
    for (const field of arrayField) {
      if (!field[this.fieldName]) return new MissingParamError(this.fieldName)
    }
  }
}
