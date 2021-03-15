import { internalServerError } from '../../../helpers/http/http-helpers'
import { Controller, HttpRequest, HttpResponse, LoadSurveys } from './load-surveys-controller-protocols'

export class LoadSurveysController implements Controller {
  constructor (
    private readonly loadSurveys: LoadSurveys
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      await this.loadSurveys.load()
      return null
    } catch (error) {
      return internalServerError(error)
    }
  }
}
