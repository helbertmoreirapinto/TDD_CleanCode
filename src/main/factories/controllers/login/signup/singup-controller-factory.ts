import { makeSingupValidator } from './singup-validator-factory'
import { makeDbAuthenticator } from '../../../usecases/authenticator/db-authenticator-factory'
import { makeDbAddAccount } from '../../../usecases/account/add-account/db-add-account-factory'
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'
import { SingUpController } from '../../../../../presentation/controllers/login/singup/singup-controller'
import { Controller } from '../../../../../presentation/protocols'

export const makeSingupController = (): Controller => {
  const controller = new SingUpController(makeDbAddAccount(), makeSingupValidator(), makeDbAuthenticator())
  return makeLogControllerDecorator(controller)
}
