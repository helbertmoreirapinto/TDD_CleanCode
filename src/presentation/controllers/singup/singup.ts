import { Controller, HttpResponse, HttpRequest, EmailValidator, AddAccount } from '../../controllers/singup/singup-protocols'
import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest, internalServerError } from '../../helpers/http-helpers'

export class SingUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFiels = ['name', 'email', 'password', 'passwordConfirmation']
    try {
      for (const field of requiredFiels) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      this.addAccount.add({
        name,
        email,
        password
      })

      return {
        statusCode: 200,
        body: 'OK'
      }
    } catch (error) {
      return internalServerError()
    }
  }
}
