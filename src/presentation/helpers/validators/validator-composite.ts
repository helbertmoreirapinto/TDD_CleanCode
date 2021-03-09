import { Validator } from '.'

export class ValidateComposite implements Validator {
  private readonly validators: Validator[]
  constructor (validators: Validator[]) {
    this.validators = validators
  }

  async validate (input: any): Promise<Error> {
    for (const validator of this.validators) {
      const error = await validator.validate(input)
      if (error) return error
    }
  }
}
