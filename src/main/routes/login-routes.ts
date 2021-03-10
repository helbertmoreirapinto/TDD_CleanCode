import { Router } from 'express'
import { makeSingupController } from '../factories/singup/singup-factory'
import { adaptRoute } from '../adapters/express/express-route-adapter'
export default (router: Router): void => {
  router.post('/singup', adaptRoute(makeSingupController()))
}
