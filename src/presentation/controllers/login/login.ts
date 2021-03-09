import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, internalServerError, ok, unauthorized } from '../../helpers/http-helpers'
import { Validator } from '../../protocols'
import { Controller, HttpRequest, HttpResponse, EmailValidator, Authenticator } from './login-protocols'

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

      const requiredFiels = ['email', 'password']
      for (const field of requiredFiels) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

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
