import { makeLoginValidator } from './login-validator-factory'
import { LogControllerDecorator } from '../../../decorators/log-controller-decorator'
import { EmailValidatorAdapter } from '../../../adapters/validators/email-validator-adapter'
import { Controller } from '../../../../presentation/controllers/login/login-controller-protocols'
import { LoginController } from '../../../../presentation/controllers/login/login-controller'
import { LogMongoRepository } from '../../../../infra/db/mongodb/log/log-mongo-repository'
import { makeDbAuthenticator } from '../../usecases/db-authenticator-factory'

export const makeLoginController = (): Controller => {
  const dbAuthenticator = makeDbAuthenticator()
  const validator = makeLoginValidator()
  const emailValidator = new EmailValidatorAdapter()
  const loginController = new LoginController(emailValidator, dbAuthenticator, validator)

  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(loginController, logMongoRepository)
}
