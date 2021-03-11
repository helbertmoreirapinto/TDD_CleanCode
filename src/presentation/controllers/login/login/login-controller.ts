import { Controller, HttpRequest, HttpResponse, Authenticator, Validator } from './login-controller-protocols'
import { badRequest, internalServerError, ok, unauthorized } from '../../../helpers/http/http-helpers'

export class LoginController implements Controller {
  constructor (
    private readonly authenticator: Authenticator,
    private readonly validator: Validator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = await this.validator.validate(httpRequest.body)
      if (error) return badRequest(error)

      const { email, password } = httpRequest.body

      const accessToken = await this.authenticator.auth({ email, password })
      if (!accessToken) return unauthorized()

      return ok({ accessToken })
    } catch (error) {
      return internalServerError(error)
    }
  }
}
