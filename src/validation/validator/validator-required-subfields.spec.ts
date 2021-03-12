import { RequiredSubfields } from '.'
import { MissingParamError } from './validator-protocols'

interface SutTypes {
  sut: RequiredSubfields
}

const makeSut = (field: string, subfield: string): SutTypes => {
  const sut = new RequiredSubfields(field, subfield)
  return {
    sut
  }
}

describe('Required Fields Validator', () => {
  test('Should return an MissingParamError if validation fails on field', async () => {
    const { sut } = makeSut('field', 'subfield')
    const error = await sut.validate({ otherField: 'any_value' })

    expect(error).toEqual(new MissingParamError('subfield'))
  })

  test('Should return an MissingParamError if validation fails on subfield', async () => {
    const { sut } = makeSut('field', 'subfield')
    const error = await sut.validate({
      field: { notSubfield: 'any_value' }
    })

    expect(error).toEqual(new MissingParamError('subfield'))
  })

  test('Should not return if validation succeeds', async () => {
    const { sut } = makeSut('field', 'subfield')
    const error = await sut.validate({
      field: { subfield: 'any_value' }
    })
    expect(error).toBeFalsy()
  })
})
