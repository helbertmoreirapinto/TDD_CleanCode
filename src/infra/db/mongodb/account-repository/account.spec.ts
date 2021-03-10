import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helpers'
import { AccountMongoRepository } from './account'

interface SutTypes {
  sut: AccountMongoRepository
}

const makeSut = (): SutTypes => {
  const sut = new AccountMongoRepository()

  return {
    sut
  }
}

let accountCoollection: Collection

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCoollection = await MongoHelper.getCollection('accounts')
    await accountCoollection.deleteMany({ })
  })

  test('Should return an account on add success', async () => {
    const { sut } = makeSut()
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
    })

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@email.com')
    expect(account.password).toBe('any_password')
  })

  test('Should return an account on loadByEmail success', async () => {
    const { sut } = makeSut()
    await accountCoollection.insertOne({
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
    })

    const account = await sut.loadByEmail('any_email@email.com')

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@email.com')
    expect(account.password).toBe('any_password')
  })
})
