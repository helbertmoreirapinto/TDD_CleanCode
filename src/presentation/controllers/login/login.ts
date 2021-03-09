import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, internalServerError, ok } from '../../helpers/http-helpers'
import { Controller, HttpRequest, HttpResponse, EmailValidator, Authenticator } from './login-protocols'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly authenticator: Authenticator

  constructor (emailValidator: EmailValidator, authenticator: Authenticator) {
    this.emailValidator = emailValidator
    this.authenticator = authenticator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFiels = ['email', 'password']
      for (const field of requiredFiels) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { email, password } = httpRequest.body
      const isEmailValid = await this.emailValidator.isValid(email)
      if (!isEmailValid) return badRequest(new InvalidParamError('email'))

      const isDataValid = await this.authenticator.auth(email, password)
      if (!isDataValid) return badRequest(new InvalidParamError('email'))

      return await new Promise(resolve => resolve(ok({})))
    } catch (error) {
      return internalServerError(error)
    }
  }
}
