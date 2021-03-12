import { badRequest } from '../../../helpers/http/http-helpers'
import { Controller, HttpRequest, HttpResponse, Validator } from './add-survey-controller-protocols'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validator: Validator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = await this.validator.validate(httpRequest.body)
    if (error) return badRequest(error)
    return await new Promise(resolve => resolve(null))
  }
}
