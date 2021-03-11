import { Controller, HttpResponse, HttpRequest, AddAccount, Validator, Authenticator } from './singup-controller-protocols'
import { badRequest, internalServerError, ok } from '../../helpers/http/http-helpers'

export class SingUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validator: Validator,
    private readonly authenticator: Authenticator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = await this.validator.validate(httpRequest.body)
      if (error) return badRequest(error)

      const { name, email, password } = httpRequest.body
      const account = await this.addAccount.add({ name, email, password })
      await this.authenticator.auth({ email, password })
      return ok(account)
    } catch (error) {
      return internalServerError(error)
    }
  }
}
