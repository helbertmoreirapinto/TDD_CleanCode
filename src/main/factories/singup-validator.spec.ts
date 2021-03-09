import { ValidateComposite, RequiredFields } from '../../presentation/helpers/validators'
import { Validator } from '../../presentation/protocols'
import { makeSingupValidator } from './singup-validator'

jest.mock('../../presentation/helpers/validators/validator-composite')

describe('SingupValidator Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSingupValidator()

    const validators: Validator[] = []

    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validators.push(new RequiredFields(field))
    }

    expect(ValidateComposite).toHaveBeenCalledWith(validators)
  })
})
