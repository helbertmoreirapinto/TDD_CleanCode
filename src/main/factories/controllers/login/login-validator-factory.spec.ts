import { ValidateComposite, RequiredFields, EmailField } from '../../../../validation/validator'
import { Validator } from '../../../../presentation/protocols'
import { makeLoginValidator } from './login-validator-factory'
import { EmailValidator } from '../../../../validation/protocols/emailValidator'

jest.mock('../../../../validation/validator/validator-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    async isValid (email: string): Promise<boolean> {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('LoginValidator Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeLoginValidator()

    const validators: Validator[] = []

    for (const field of ['email', 'password']) {
      validators.push(new RequiredFields(field))
    }
    validators.push(new EmailField('email', makeEmailValidator()))

    expect(ValidateComposite).toHaveBeenCalledWith(validators)
  })
})
