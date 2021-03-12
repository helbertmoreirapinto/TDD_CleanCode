import { LoadAccountByToken, Decrypter, LoadAccountByTokenRepository, AccountModel } from './db-load-account-by-token-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decryper: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async loadByToken (token: string, role?: string): Promise<AccountModel> {
    const decryptedToken = await this.decryper.decrypt(token)
    if (decryptedToken) {
      const account = await this.loadAccountByTokenRepository.loadByToken(decryptedToken, role)
      if (account) return account
    }
    return null
  }
}
