import { RequiredFields } from '.'
import { MissingParamError } from '../../errors'

interface SutTypes {
  sut: RequiredFields
}

const makeSut = (field: string): SutTypes => {
  const sut = new RequiredFields(field)

  return {
    sut
  }
}

describe('Required Fields Validator', () => {
  test('Should return an MissingParamError if validation fails', async () => {
    const { sut } = makeSut('field')
    const error = await sut.validate({ otherField: 'any_value' })

    expect(error).toEqual(new MissingParamError('field'))
  })
})
