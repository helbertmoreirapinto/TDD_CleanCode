import { CompareFields } from '.'
import { InvalidParamError } from '../../errors'

interface SutTypes {
  sut: CompareFields
}

const makeSut = (field: string, fieldToCompare: string): SutTypes => {
  const sut = new CompareFields(field, fieldToCompare)

  return {
    sut
  }
}

describe('Required Fields Validator', () => {
  test('Should return an MissingParamError if validation fails', async () => {
    const { sut } = makeSut('field', 'otherField')
    const error = await sut.validate({
      field: 'any_value',
      otherField: 'other_value'
    })

    expect(error).toEqual(new InvalidParamError('otherField'))
  })

  test('Should not return if validation succeeds', async () => {
    const { sut } = makeSut('field', 'otherField')
    const error = await sut.validate({
      field: 'any_value',
      otherField: 'any_value'
    })
    expect(error).toBeFalsy()
  })
})
