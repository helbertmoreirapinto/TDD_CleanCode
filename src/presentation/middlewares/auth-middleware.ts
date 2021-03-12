import { LoadAccountByToken } from '../../domain/usecases/load-account'
import { AccessDeniedError } from '../errors'
import { forbidden } from '../helpers/http/http-helpers'
import { Middleware, HttpRequest, HttpResponse } from '../protocols/'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const token = httpRequest.headers?.['x-access-token']
    if (token) {
      await this.loadAccountByToken.loadByToken(token)
    }
    return forbidden(new AccessDeniedError())
  }
}
