import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'
import { Controller } from '../../../../../presentation/protocols'
import { AddSurveyController } from '../../../../../presentation/controllers/survey/add-survey/add-survey-controller'
import { makeAddSurveyValidator } from './add-survey-validator-factory'
import { makeDbAddSurvey } from '../../../usecases/survey/add-survey/db-add-survey'

export const makeAddSurveyController = (): Controller => {
  const controller = new AddSurveyController(makeAddSurveyValidator(), makeDbAddSurvey())
  return makeLogControllerDecorator(controller)
}
