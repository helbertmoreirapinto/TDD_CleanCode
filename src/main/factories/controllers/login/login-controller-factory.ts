import { makeLoginValidator } from './login-validator-factory'
import { Controller } from '../../../../presentation/controllers/login/login-controller-protocols'
import { LoginController } from '../../../../presentation/controllers/login/login-controller'
import { makeDbAuthenticator } from '../../usecases/authenticator/db-authenticator-factory'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'

export const makeLoginController = (): Controller => {
  const controller = new LoginController(makeDbAuthenticator(), makeLoginValidator())
  return makeLogControllerDecorator(controller)
}
