import { Controller } from '../../../presentation/controllers/singup/singup-protocols'
import { SingUpController } from '../../../presentation/controllers/singup/singup'
import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository/account'
import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log'
import { BCryptAdapter } from '../../../infra/criptography/bcrypt-adapter'
import { LogControllerDecorator } from '../../decorators/log'
import { makeSingupValidator } from './singup-validator'

export const makeSingupController = (): Controller => {
  const salt = 12
  const bCryptAdapter = new BCryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()

  const dbAddAccount = new DbAddAccount(bCryptAdapter, accountMongoRepository)

  const validator = makeSingupValidator()

  const singupController = new SingUpController(dbAddAccount, validator)

  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(singupController, logMongoRepository)
}
