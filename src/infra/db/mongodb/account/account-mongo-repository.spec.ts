import { Collection } from 'mongodb'
import { AddAccountModel } from '../../../../domain/usecases/account/add-account'
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

  describe('function add()', () => {
    test('Should return an account on add success', async () => {
      const { sut } = makeSut()
      const account = await sut.add(makeFakeAddAccount())

      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@email.com')
      expect(account.password).toBe('any_password')
    })
  })

  describe('function updateToken()', () => {
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

  describe('function loadByEmail()', () => {
    test('Should return null if loadByEmail fails', async () => {
      const { sut } = makeSut()
      const account = await sut.loadByEmail('any_email@email.com')
      expect(account).toBeFalsy()
    })

    test('Should return an account on loadByEmail success', async () => {
      const { sut } = makeSut()
      const res = await accountCollection.insertOne(makeFakeAddAccount())
      const { _id: id } = res.ops[0]

      const account = await sut.loadByEmail('any_email@email.com')
      expect(account).toEqual({
        id,
        ...makeFakeAddAccount()
      })
    })
  })

  describe('function loadByToken()', () => {
    test('Should return null if loadByToken fails', async () => {
      const { sut } = makeSut()
      const account = await sut.loadByToken('any_token')
      expect(account).toBeFalsy()
    })

    test('Should return an account on loadByToken without role success', async () => {
      const accessToken = 'any_token'
      const { sut } = makeSut()
      const res = await accountCollection.insertOne({
        accessToken,
        ...makeFakeAddAccount()
      })
      const { _id: id } = res.ops[0]

      const account = await sut.loadByToken(accessToken)
      expect(account).toEqual({
        id,
        accessToken,
        ...makeFakeAddAccount()
      })
    })

    test('Should return an account on loadByToken with admin role success', async () => {
      const accessToken = 'any_token'
      const role = 'admin'
      const { sut } = makeSut()
      const res = await accountCollection.insertOne({
        accessToken,
        role,
        ...makeFakeAddAccount()
      })
      const { _id: id } = res.ops[0]

      const account = await sut.loadByToken(accessToken, role)
      expect(account).toEqual({
        id,
        accessToken,
        role,
        ...makeFakeAddAccount()
      })
    })

    test('Should return null on loadByToken with invalid role', async () => {
      const accessToken = 'any_token'
      const { sut } = makeSut()
      await accountCollection.insertOne({
        accessToken,
        ...makeFakeAddAccount()
      })

      const account = await sut.loadByToken(accessToken, 'admin')
      expect(account).toBeFalsy()
    })

    test('Should return an account on loadByToken if user is admin', async () => {
      const accessToken = 'any_token'
      const role = 'admin'
      const { sut } = makeSut()
      const res = await accountCollection.insertOne({
        accessToken,
        role,
        ...makeFakeAddAccount()
      })
      const { _id: id } = res.ops[0]

      const account = await sut.loadByToken(accessToken)
      expect(account).toEqual({
        id,
        accessToken,
        role,
        ...makeFakeAddAccount()
      })
    })
  })
})
