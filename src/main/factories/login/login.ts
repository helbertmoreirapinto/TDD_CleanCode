import { Controller } from '../../../presentation/controllers/login/login-protocols'
import { LoginController } from '../../../presentation/controllers/login/login'
import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log'
import { LogControllerDecorator } from '../../decorators/log'
import { makeLoginValidator } from './login-validator'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

export const makeLoginController = (): Controller => {
  const validator = makeLoginValidator()
  const emailValidator = new EmailValidatorAdapter()
  const singupController = new LoginController(emailValidator, null, validator)

  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(singupController, logMongoRepository)
}
