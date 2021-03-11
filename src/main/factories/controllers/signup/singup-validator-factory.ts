import { ValidateComposite, RequiredFields, CompareFields, EmailField } from '../../../../presentation/helpers/validators'
import { Validator } from '../../../../presentation/protocols'
import { EmailValidatorAdapter } from '../../../adapters/validators/email-validator-adapter'

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
