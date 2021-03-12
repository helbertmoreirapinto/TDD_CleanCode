import { ValidateComposite, RequiredFields, TypeArrayField, RequiredArrayFields } from '../../../../../validation/validator'
import { Validator } from '../../../../../presentation/protocols'
import { makeAddSurveyValidator } from './add-survey-validator-factory'

jest.mock('../../../../../validation/validator/validator-composite')

describe('AddSurvey Validator Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeAddSurveyValidator()

    const validators: Validator[] = []

    for (const field of ['question', 'answers']) {
      validators.push(new RequiredFields(field))
    }
    validators.push(new TypeArrayField('answers'))
    validators.push(new RequiredArrayFields('answers', 'answer'))

    expect(ValidateComposite).toHaveBeenCalledWith(validators)
  })
})
