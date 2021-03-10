import { Authenticator, AuthenticatorModel, LoadAccountByEmailRepository, HashComparer, Encrypter, UpdateAccessTokenRepository } from './db-authenticator-protocols'

export class DbAuthenticator implements Authenticator {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer
  private readonly encrypter: Encrypter
  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository

  constructor (
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: HashComparer,
    encrypter: Encrypter,
    updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
    this.encrypter = encrypter
    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  async auth (authData: AuthenticatorModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(authData.email)
    if (account) {
      const compare = await this.hashComparer.compare(authData.password, account.password)
      if (compare) {
        const token = await this.encrypter.encrypt(account.id)
        await this.updateAccessTokenRepository.update(account.id, token)
        return token
      }
    }
    return null
  }
}
