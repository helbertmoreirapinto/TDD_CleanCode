import { Controller } from '../../../presentation/controllers/login/login-protocols'
import { LoginController } from '../../../presentation/controllers/login/login'
import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log'
import { LogControllerDecorator } from '../../decorators/log'
import { makeLoginValidator } from './login-validator'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'
import { DbAuthenticator } from '../../../data/usecases/authenticator/db-authenticator'
import { BCryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adater'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository/account'

export const makeLoginController = (): Controller => {
  const salt = +process.env.SALT || 12
  const bCryptAdapter = new BCryptAdapter(salt)

  const secretKey = process.env.SECRET_KEY || 'new_secret_key'
  const jwtAdapter = new JwtAdapter(secretKey)

  const accountMongoRepository = new AccountMongoRepository()

  const dbAuthenticator = new DbAuthenticator(bCryptAdapter, jwtAdapter, accountMongoRepository, accountMongoRepository)

  const emailValidator = new EmailValidatorAdapter()
  const validator = makeLoginValidator()
  const loginController = new LoginController(emailValidator, dbAuthenticator, validator)

  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(loginController, logMongoRepository)
}
