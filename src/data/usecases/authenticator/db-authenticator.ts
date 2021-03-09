import { Authenticator, AuthenticatorModel, LoadAccountByEmailRepository, HashComparer, TokenGenerator } from './db-authenticator-protocols'

export class DbAuthenticator implements Authenticator {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer
  private readonly tokenGenerator: TokenGenerator

  constructor (
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: HashComparer,
    tokenGenerator: TokenGenerator
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
    this.tokenGenerator = tokenGenerator
  }

  async auth (authData: AuthenticatorModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(authData.email)
    if (account) {
      const compare = await this.hashComparer.compare(authData.password, account.password)
      if (compare) {
        return await this.tokenGenerator.generate(account.id)
      }
    }
    return null
  }
}
