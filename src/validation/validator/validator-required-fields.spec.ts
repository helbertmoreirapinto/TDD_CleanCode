import { RequiredFields } from '.'
import { MissingParamError } from './validator-protocols'

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

  test('Should not return if validation succeeds', async () => {
    const { sut } = makeSut('field')
    const error = await sut.validate({ field: 'any_value' })

    expect(error).toBeFalsy()
  })
})
