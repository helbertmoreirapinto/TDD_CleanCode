import { LoadAccountByToken } from '../../../domain/usecases/load-account'
import { Decrypter } from '../../protocols/criptography/decrypter'
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository'
import { AccountModel } from '../add-account/db-add-account-protocols'

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
