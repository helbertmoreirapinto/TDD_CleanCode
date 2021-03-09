import { ValidateComposite, RequiredFields } from '../../presentation/helpers/validators'
import { Validator } from '../../presentation/protocols'

export const makeSingupValidator = (): ValidateComposite => {
  const validators: Validator[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validators.push(new RequiredFields(field))
  }
  return new ValidateComposite(validators)
}
