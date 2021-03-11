import { makeLoginValidator } from './login-validator-factory'
import { makeDbAuthenticator } from '../../usecases/authenticator/db-authenticator-factory'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'
import { LoginController } from '../../../../presentation/controllers/login/login/login-controller'
import { Controller } from '../../../../presentation/protocols'

export const makeLoginController = (): Controller => {
  const controller = new LoginController(makeDbAuthenticator(), makeLoginValidator())
  return makeLogControllerDecorator(controller)
}
