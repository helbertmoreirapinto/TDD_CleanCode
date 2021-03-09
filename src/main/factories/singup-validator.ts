import { ValidateComposite, RequiredFields, CompareFields } from '../../presentation/helpers/validators'
import { Validator } from '../../presentation/protocols'

export const makeSingupValidator = (): ValidateComposite => {
  const validators: Validator[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validators.push(new RequiredFields(field))
  }
  validators.push(new CompareFields('password', 'passwordConfirmation'))

  return new ValidateComposite(validators)
}
