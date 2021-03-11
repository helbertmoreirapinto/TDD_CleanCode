import { Controller, HttpResponse, HttpRequest, AddAccount, Validator, Authenticator } from './singup-controller-protocols'
import { badRequest, forbidden, internalServerError, ok } from '../../helpers/http/http-helpers'
import { EmailInUseError } from '../../errors'

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
      if (!account) return forbidden(new EmailInUseError())

      const acessToken = await this.authenticator.auth({ email, password })
      return ok({ acessToken })
    } catch (error) {
      return internalServerError(error)
    }
  }
}
