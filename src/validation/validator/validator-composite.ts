import { Validator } from './validator-protocols'

export class ValidateComposite implements Validator {
  constructor (private readonly validators: Validator[]) {}

  async validate (input: any): Promise<Error> {
    for (const validator of this.validators) {
      const error = await validator.validate(input)
      if (error) return error
    }
  }
}
