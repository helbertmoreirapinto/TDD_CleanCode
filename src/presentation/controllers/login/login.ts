import { Controller, HttpRequest, HttpResponse, EmailValidator, Authenticator, Validator } from './login-protocols'
import { badRequest, internalServerError, ok, unauthorized } from '../../helpers/http/http-helpers'
import { InvalidParamError } from '../../errors'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly authenticator: Authenticator
  private readonly validator: Validator

  constructor (emailValidator: EmailValidator, authenticator: Authenticator, validator: Validator) {
    this.emailValidator = emailValidator
    this.authenticator = authenticator
    this.validator = validator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = await this.validator.validate(httpRequest.body)
      if (error) return badRequest(error)

      const { email, password } = httpRequest.body
      const isEmailValid = await this.emailValidator.isValid(email)
      if (!isEmailValid) return badRequest(new InvalidParamError('email'))

      const accessToken = await this.authenticator.auth(email, password)
      if (!accessToken) return unauthorized()

      return ok({ accessToken })
    } catch (error) {
      return internalServerError(error)
    }
  }
}
