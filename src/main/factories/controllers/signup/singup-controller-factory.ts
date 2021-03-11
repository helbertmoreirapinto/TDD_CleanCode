import { Controller } from '../../../../presentation/controllers/singup/singup-controller-protocols'
import { SingUpController } from '../../../../presentation/controllers/singup/singup-controller'
import { makeSingupValidator } from './singup-validator-factory'
import { makeDbAuthenticator } from '../../usecases/authenticator/db-authenticator-factory'
import { makeDbAddAccount } from '../../usecases/add-account/db-add-account-factory'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'

export const makeSingupController = (): Controller => {
  const controller = new SingUpController(makeDbAddAccount(), makeSingupValidator(), makeDbAuthenticator())
  return makeLogControllerDecorator(controller)
}
