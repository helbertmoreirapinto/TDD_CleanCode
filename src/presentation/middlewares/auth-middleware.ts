import { LoadAccountByToken } from '../../domain/usecases/load-account'
import { AccessDeniedError } from '../errors'
import { forbidden, internalServerError, ok } from '../helpers/http/http-helpers'
import { Middleware, HttpRequest, HttpResponse } from '../protocols/'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role: string
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const token = httpRequest.headers?.['x-access-token']
      if (token) {
        const account = await this.loadAccountByToken.loadByToken(token, this.role)
        if (account) return ok({ accountId: account.id })
      }
      return forbidden(new AccessDeniedError())
    } catch (error) {
      return internalServerError(error)
    }
  }
}
