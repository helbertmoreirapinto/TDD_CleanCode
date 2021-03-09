import { Router } from 'express'
import { makeSingupController } from '../factories/singup/singup'
import { adaptRoute } from '../adapters/express-route-adapter'
export default (router: Router): void => {
  router.post('/singup', adaptRoute(makeSingupController()))
}
