import { ValidateComposite, RequiredFields, TypeArrayField, RequiredArrayFields } from '../../../../../validation/validator'
import { Validator } from '../../../../../presentation/protocols'

export const makeAddSurveyValidator = (): ValidateComposite => {
  const validators: Validator[] = []
  for (const field of ['question', 'answers']) {
    validators.push(new RequiredFields(field))
  }
  validators.push(new TypeArrayField('answers'))
  validators.push(new RequiredArrayFields('answers', 'answer'))
  return new ValidateComposite(validators)
}
