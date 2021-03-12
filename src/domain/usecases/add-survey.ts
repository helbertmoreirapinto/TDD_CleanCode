import { AnswerModel, SurveyModel } from '../models/survey'

export interface AddSurveyModel {
  question: string
  answers: AnswerModel[]
}

export interface AddSurvey {
  add (survey: AddSurveyModel): Promise<SurveyModel>
}
