import { Authenticator, AuthenticatorModel, LoadAccountByEmailRepository, HashComparer, Encrypter, UpdateTokenRepository } from './db-authenticator-protocols'

export class DbAuthenticator implements Authenticator {
  constructor (
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly updateTokenRepository: UpdateTokenRepository
  ) {}

  async auth (authData: AuthenticatorModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(authData.email)
    if (account) {
      const compare = await this.hashComparer.compare(authData.password, account.password)
      if (compare) {
        const token = await this.encrypter.encrypt(account.id)
        await this.updateTokenRepository.updateToken(account.id, token)
        return token
      }
    }
    return null
  }
}
