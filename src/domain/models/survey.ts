import { Model } from './model'

export interface AnswerModel{
  image: string
  answer: string
}

export interface SurveyModel extends Model{
  question: string
  answers: AnswerModel[]
}
