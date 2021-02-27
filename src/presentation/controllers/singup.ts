import { MissingParamError, InvalidParamError } from '../errors/'
import { HttpResponse, HttpRequest } from '../protocols/http'
import { badRequest, internalServerError } from '../helpers/http-helpers'
import { Controller, EmailValidator } from '../protocols/'

export class SingUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFiels = ['name', 'email', 'password', 'passwordConfirmation']
    try {
      for (const field of requiredFiels) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const isValid = this.emailValidator.isValid(httpRequest.body.email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
    } catch (error) {
      return internalServerError()
    }

    return {
      statusCode: 200,
      body: 'OK'
    }
  }
}
