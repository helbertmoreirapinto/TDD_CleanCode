import env from '../../../../config/env'
import { DbAddAccount } from '../../../../../data/usecases/account/add-account/db-add-account'
import { AddAccount } from '../../../../../domain/usecases/account/add-account'
import { BCryptAdapter } from '../../../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '../../../../../infra/db/mongodb/account/account-mongo-repository'

export const makeDbAddAccount = (): AddAccount => {
  const salt = env.salt
  const bCryptAdapter = new BCryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbAddAccount(bCryptAdapter, accountMongoRepository, accountMongoRepository)
}
