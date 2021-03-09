import { ValidateComposite, RequiredFields, EmailField } from '../../../presentation/helpers/validators'
import { EmailValidator, Validator } from '../../../presentation/protocols'
import { makeLoginValidator } from './login-validator'

jest.mock('../../../presentation/helpers/validators/validator-composite')

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
