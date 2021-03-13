import env from '../../../../config/env'
import { DbLoadAccountByToken } from '../../../../../data/usecases/account/load-account-by-token/db-load-account-by-token'
import { LoadAccountByToken } from '../../../../../presentation/middlewares/auth-middleware-protocols'
import { AccountMongoRepository } from '../../../../../infra/db/mongodb/account/account-mongo-repository'
import { JwtAdapter } from '../../../../../infra/criptography/jwt-adapter/jwt-adater'

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbLoadAccountByToken(jwtAdapter, accountMongoRepository)
}
