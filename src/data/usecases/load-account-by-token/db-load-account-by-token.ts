import { LoadAccountByToken } from '../../../domain/usecases/load-account'
import { Decrypter } from '../../protocols/criptography/decrypter'
import { LoadAccountByAccessTokenRepository } from '../../protocols/db/account/load-account-by-access-token-repository'
import { AccountModel } from '../add-account/db-add-account-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decryper: Decrypter,
    private readonly loadAccountByAccessTokenRepository: LoadAccountByAccessTokenRepository
  ) {}

  async loadByToken (token: string, role?: string): Promise<AccountModel> {
    const value = await this.decryper.decrypt(token)
    await this.loadAccountByAccessTokenRepository.loadByAccessToken(value)
    return await new Promise(resolve => resolve(null))
  }
}
