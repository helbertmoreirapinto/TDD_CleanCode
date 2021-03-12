import { ValidateComposite, RequiredFields, EmailField } from '../../../../../validation/validator'
import { Validator } from '../../../../../presentation/protocols'
import { EmailValidatorAdapter } from '../../../../../infra/validators/email-validator-adapter'

export const makeLoginValidator = (): ValidateComposite => {
  const emailValidator = new EmailValidatorAdapter()
  const validators: Validator[] = []
  for (const field of ['email', 'password']) {
    validators.push(new RequiredFields(field))
  }
  validators.push(new EmailField('email', emailValidator))

  return new ValidateComposite(validators)
}
