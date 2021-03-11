import env from '../../config/env'
import { Controller } from '../../../presentation/controllers/singup/singup-controller-protocols'
import { SingUpController } from '../../../presentation/controllers/singup/singup-controller'
import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { BCryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { makeSingupValidator } from './singup-validator-factory'
import { DbAuthenticator } from '../../../data/usecases/authenticator/db-authenticator'
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adater'

export const makeSingupController = (): Controller => {
  const salt = env.salt
  const bCryptAdapter = new BCryptAdapter(salt)

  const accountMongoRepository = new AccountMongoRepository()

  const dbAddAccount = new DbAddAccount(bCryptAdapter, accountMongoRepository, accountMongoRepository)

  const validator = makeSingupValidator()

  const secretKey = env.jwtSecret
  const jwtAdapter = new JwtAdapter(secretKey)
  const dbAuthenticator = new DbAuthenticator(bCryptAdapter, jwtAdapter, accountMongoRepository, accountMongoRepository)

  const singupController = new SingUpController(dbAddAccount, validator, dbAuthenticator)

  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(singupController, logMongoRepository)
}
