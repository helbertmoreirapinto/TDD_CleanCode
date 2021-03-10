import { Controller } from '../../../presentation/controllers/login/login-protocols'
import { LoginController } from '../../../presentation/controllers/login/login'
import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log'
import { LogControllerDecorator } from '../../decorators/log'
import { makeLoginValidator } from './login-validator'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'
import { DbAuthenticator } from '../../../data/usecases/authenticator/db-authenticator'

export const makeLoginController = (): Controller => {
  const dbAuthenticator = new DbAuthenticator(null, null, null, null)
  const validator = makeLoginValidator()
  const emailValidator = new EmailValidatorAdapter()
  const loginController = new LoginController(emailValidator, dbAuthenticator, validator)

  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(loginController, logMongoRepository)
}
