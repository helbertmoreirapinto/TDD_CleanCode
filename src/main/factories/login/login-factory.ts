import { makeLoginValidator } from './login-validator-factory'
import env from '../../config/env'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { EmailValidatorAdapter } from '../../adapters/validators/email-validator-adapter'
import { Controller } from '../../../presentation/controllers/login/login-controller-protocols'
import { LoginController } from '../../../presentation/controllers/login/login-controller'
import { DbAuthenticator } from '../../../data/usecases/authenticator/db-authenticator'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { BCryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adater'

export const makeLoginController = (): Controller => {
  const salt = env.salt
  const bCryptAdapter = new BCryptAdapter(salt)

  const secretKey = env.jwtSecret
  const jwtAdapter = new JwtAdapter(secretKey)

  const accountMongoRepository = new AccountMongoRepository()

  const dbAuthenticator = new DbAuthenticator(bCryptAdapter, jwtAdapter, accountMongoRepository, accountMongoRepository)

  const emailValidator = new EmailValidatorAdapter()
  const validator = makeLoginValidator()
  const loginController = new LoginController(emailValidator, dbAuthenticator, validator)

  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(loginController, logMongoRepository)
}
