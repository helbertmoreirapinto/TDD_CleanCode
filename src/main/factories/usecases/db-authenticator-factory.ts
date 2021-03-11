import env from '../../config/env'
import { DbAuthenticator } from '../../../data/usecases/authenticator/db-authenticator'
import { BCryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adater'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { Authenticator } from '../../../domain/usecases/authenticator'

export const makeDbAuthenticator = (): Authenticator => {
  const salt = env.salt
  const bCryptAdapter = new BCryptAdapter(salt)

  const secretKey = env.jwtSecret
  const jwtAdapter = new JwtAdapter(secretKey)

  const accountMongoRepository = new AccountMongoRepository()

  return new DbAuthenticator(bCryptAdapter, jwtAdapter, accountMongoRepository, accountMongoRepository)
}
