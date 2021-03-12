import { AddSurvey, AddSurveyModel, AddSurveyRepository } from './db-add-survey-protocols'

export class DbAddSurvey implements AddSurvey {
  constructor (
    private readonly addSurveyRepositoryStub: AddSurveyRepository
  ) {}

  async add (survey: AddSurveyModel): Promise<void> {
    await this.addSurveyRepositoryStub.add(survey)
    return null
  }
}
