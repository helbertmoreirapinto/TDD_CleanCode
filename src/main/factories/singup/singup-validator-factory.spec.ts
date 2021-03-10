import { ValidateComposite, RequiredFields, CompareFields, EmailField } from '../../../presentation/helpers/validators'
import { EmailValidator, Validator } from '../../../presentation/protocols'
import { makeSingupValidator } from './singup-validator-factory'

jest.mock('../../../presentation/helpers/validators/validator-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    async isValid (email: string): Promise<boolean> {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('SingupValidator Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSingupValidator()

    const validators: Validator[] = []

    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validators.push(new RequiredFields(field))
    }
    validators.push(new CompareFields('password', 'passwordConfirmation'))
    validators.push(new EmailField('email', makeEmailValidator()))

    expect(ValidateComposite).toHaveBeenCalledWith(validators)
  })
})
