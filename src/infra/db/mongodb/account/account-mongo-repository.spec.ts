import { Collection } from 'mongodb'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helpers'
import { AccountMongoRepository } from './account-mongo-repository'

interface SutTypes {
  sut: AccountMongoRepository
}

const makeFakeAddAccount = (): AddAccountModel => ({
  name: 'any_name',
  email: 'any_email@email.com',
  password: 'any_password'
})

const makeSut = (): SutTypes => {
  const sut = new AccountMongoRepository()

  return {
    sut
  }
}

let accountCollection: Collection

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({ })
  })

  test('Should return an account on add success', async () => {
    const { sut } = makeSut()
    const account = await sut.add(makeFakeAddAccount())

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@email.com')
    expect(account.password).toBe('any_password')
  })

  test('Should return an account on loadByEmail success', async () => {
    const { sut } = makeSut()
    await accountCollection.insertOne(makeFakeAddAccount())

    const account = await sut.loadByEmail('any_email@email.com')
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@email.com')
    expect(account.password).toBe('any_password')
  })

  test('Should return null if loadByEmail fails', async () => {
    const { sut } = makeSut()
    const account = await sut.loadByEmail('any_email@email.com')
    expect(account).toBeFalsy()
  })

  test('Should update the account accessToken on updateAccessToken success', async () => {
    const { sut } = makeSut()
    const res = await accountCollection.insertOne(makeFakeAddAccount())
    const account = res.ops[0]

    expect(account.accessToken).toBeFalsy()

    await sut.updateToken(account._id, 'any_token')

    const updatedAccount = await accountCollection.findOne({ _id: account._id })
    expect(updatedAccount.accessToken).toBeTruthy()
  })
})
