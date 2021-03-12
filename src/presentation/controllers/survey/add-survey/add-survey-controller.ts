import { badRequest, internalServerError } from '../../../helpers/http/http-helpers'
import { Controller, HttpRequest, HttpResponse, Validator, AddSurvey } from './add-survey-controller-protocols'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validator: Validator,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = await this.validator.validate(httpRequest.body)
      if (error) return badRequest(error)

      await this.addSurvey.add(httpRequest.body)
      return await new Promise(resolve => resolve(null))
    } catch (error) {
      return internalServerError(error)
    }
  }
}
