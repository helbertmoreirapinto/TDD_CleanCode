import { SingUpController } from '../../presentation/controllers/singup/singup'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { BCryptAdapter } from '../../infra/criptografy/bcrypt-adapter'

export const makeSingupController = (): SingUpController => {
  const salt = 12
  const bCryptAdapter = new BCryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()

  const dbAddAccount = new DbAddAccount(bCryptAdapter, accountMongoRepository)

  const emailValidatorAdapter = new EmailValidatorAdapter()

  return new SingUpController(emailValidatorAdapter, dbAddAccount)
}
