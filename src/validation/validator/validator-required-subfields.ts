import { MissingParamError, Validator } from './validator-protocols'

export class RequiredSubfields implements Validator {
  constructor (
    private readonly fieldName: string,
    private readonly subfieldName: string
  ) {}

  async validate (input: any): Promise<Error> {
    const field = input[this.fieldName]
    if (!field || !field[this.subfieldName]) return new MissingParamError(this.subfieldName)
  }
}
