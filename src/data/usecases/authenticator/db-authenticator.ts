import { Authenticator, AuthenticatorModel, LoadAccountByEmailRepository, HashComparer } from './db-authenticator-protocols'

export class DbAuthenticator implements Authenticator {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer

  constructor (loadAccountByEmailRepository: LoadAccountByEmailRepository, hashComparer: HashComparer) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
  }

  async auth (authData: AuthenticatorModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(authData.email)
    if (account) {
      await this.hashComparer.compare(authData.password, account.password)
    }
    return null
  }
}
