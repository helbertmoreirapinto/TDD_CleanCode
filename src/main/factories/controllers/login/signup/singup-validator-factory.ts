import { ValidateComposite, RequiredFields, CompareFields, EmailField } from '../../../../../validation/validator'
import { Validator } from '../../../../../presentation/protocols'
import { EmailValidatorAdapter } from '../../../../../infra/validators/email-validator-adapter'

export const makeSingupValidator = (): ValidateComposite => {
  const emailValidator = new EmailValidatorAdapter()
  const validators: Validator[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validators.push(new RequiredFields(field))
  }
  validators.push(new CompareFields('password', 'passwordConfirmation'))
  validators.push(new EmailField('email', emailValidator))

  return new ValidateComposite(validators)
}
