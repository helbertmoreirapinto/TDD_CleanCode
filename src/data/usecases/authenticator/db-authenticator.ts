import { Authenticator, AuthenticatorModel, LoadAccountByEmailRepository } from './db-authenticator-protocols'

export class DbAuthenticator implements Authenticator {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository

  constructor (loadAccountByEmailRepository: LoadAccountByEmailRepository) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
  }

  async auth (authData: AuthenticatorModel): Promise<string> {
    await this.loadAccountByEmailRepository.load(authData.email)
    return await new Promise(resolve => resolve(''))
  }
}
