import { RequiredArrayFields } from '.'
import { InvalidParamError } from '../../presentation/errors'
import { MissingParamError } from './validator-protocols'

interface SutTypes {
  sut: RequiredArrayFields
}

const makeSut = (arrayField: string, field: string): SutTypes => {
  const sut = new RequiredArrayFields(arrayField, field)
  return {
    sut
  }
}

describe('Required Fields Validator', () => {
  test('Should return an MissingParamError if validation fails on arrayField', async () => {
    const { sut } = makeSut('arrayField', 'field')
    const error = await sut.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingParamError('arrayField'))
  })

  test('Should return an MissingParamError if validation fails on arrayField type', async () => {
    const { sut } = makeSut('arrayField', 'field')
    const error = await sut.validate({
      arrayField: { field: 'any_value' }
    })
    expect(error).toEqual(new InvalidParamError('arrayField'))
  })

  test('Should return an MissingParamError if validation fails on arrayField length', async () => {
    const { sut } = makeSut('arrayField', 'field')
    const error = await sut.validate({
      arrayField: []
    })
    expect(error).toEqual(new InvalidParamError('arrayField'))
  })

  test('Should return an MissingParamError if validation fails on any field', async () => {
    const { sut } = makeSut('arrayField', 'field')
    const error = await sut.validate({
      arrayField: [
        { field: 'any_value1', otherField: 'other_valueA' },
        { otherField: 'other_value' },
        { field: 'any_value2', otherField: 'other_valueB' }
      ]
    })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should not return if validation succeeds', async () => {
    const { sut } = makeSut('arrayField', 'field')
    const error = await sut.validate({
      arrayField: [
        { field: 'any_value1', otherField: 'other_valueA' },
        { field: 'any_value2', otherField: 'other_valueB' },
        { field: 'any_value3', otherField: 'other_valueC' }

      ]
    })
    expect(error).toBeFalsy()
  })
})
