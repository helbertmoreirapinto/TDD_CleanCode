import { Model } from './model'

export interface SurveyAnswerModel{
  image: string
  answer: string
}

export interface SurveyModel extends Model{
  question: string
  answers: SurveyAnswerModel[]
}
