import { SingUpController } from '../../presentation/controllers/singup/singup'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log'
import { BCryptAdapter } from '../../infra/criptografy/bcrypt-adapter'
import { Controller } from '../../presentation/protocols'
import { LogControllerDecorator } from '../decorators/log'

export const makeSingupController = (): Controller => {
  const salt = 12
  const bCryptAdapter = new BCryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()

  const dbAddAccount = new DbAddAccount(bCryptAdapter, accountMongoRepository)

  const emailValidatorAdapter = new EmailValidatorAdapter()

  const singupController = new SingUpController(emailValidatorAdapter, dbAddAccount)

  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(singupController, logMongoRepository)
}
