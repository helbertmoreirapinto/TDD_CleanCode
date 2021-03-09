import { InternalServerError, UnauthorizedError } from '../errors/'
import { HttpResponse } from '../protocols/http'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError()
})

export const internalServerError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new InternalServerError(error.stack)
})

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})
