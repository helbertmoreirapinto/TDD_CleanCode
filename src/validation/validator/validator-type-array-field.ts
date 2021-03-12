import { InvalidParamError } from '../../presentation/errors'
import { MissingParamError, Validator } from './validator-protocols'

export class TypeArrayField implements Validator {
  constructor (
    private readonly fieldName: string
  ) {}

  async validate (input: any): Promise<Error> {
    const field = input[this.fieldName]
    if (!field) return new MissingParamError(this.fieldName)
    if (!field.length) return new InvalidParamError(this.fieldName)
  }
}
