import { MissingParamError, Validator } from './validator-protocols'

export class RequiredFields implements Validator {
  constructor (private readonly fieldName: string) {}

  async validate (input: any): Promise<Error> {
    if (!input[this.fieldName]) return new MissingParamError(this.fieldName)
  }
}
