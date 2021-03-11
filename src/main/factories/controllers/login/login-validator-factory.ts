import { ValidateComposite, RequiredFields, EmailField } from '../../../../presentation/helpers/validators'
import { Validator } from '../../../../presentation/protocols'
import { EmailValidatorAdapter } from '../../../adapters/validators/email-validator-adapter'

export const makeLoginValidator = (): ValidateComposite => {
  const emailValidator = new EmailValidatorAdapter()
  const validators: Validator[] = []
  for (const field of ['email', 'password']) {
    validators.push(new RequiredFields(field))
  }
  validators.push(new EmailField('email', emailValidator))

  return new ValidateComposite(validators)
}
