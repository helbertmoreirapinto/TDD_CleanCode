import { TypeArrayField } from '.'
import { InvalidParamError } from '../../presentation/errors'
import { MissingParamError } from './validator-protocols'

interface SutTypes {
  sut: TypeArrayField
}

const makeSut = (field: string): SutTypes => {
  const sut = new TypeArrayField(field)
  return {
    sut
  }
}

describe('Required Fields Validator', () => {
  test('Should return an MissingParamError if validation fails on field', async () => {
    const { sut } = makeSut('field')
    const error = await sut.validate({ otherField: 'any_value' })

    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should return an MissingParamError if validation fails on field type', async () => {
    const { sut } = makeSut('field')
    const error = await sut.validate({
      field: { subfield: 'any_value' }
    })
    expect(error).toEqual(new InvalidParamError('field'))
  })

  test('Should return an MissingParamError if validation fails on field type', async () => {
    const { sut } = makeSut('field')
    const error = await sut.validate({
      field: []
    })
    expect(error).toEqual(new InvalidParamError('field'))
  })

  test('Should not return if validation succeeds', async () => {
    const { sut } = makeSut('field')
    const error = await sut.validate({
      field: ['any_value', 'other_value']
    })
    expect(error).toBeFalsy()
  })
})
