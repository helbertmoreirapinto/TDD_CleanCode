import { LoadAccountByToken } from '../../../domain/usecases/load-account'
import { Decrypter } from '../../protocols/criptography/decrypter'
import { AccountModel } from '../add-account/db-add-account-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decryper: Decrypter
  ) {}

  async loadByToken (token: string, role?: string): Promise<AccountModel> {
    await this.decryper.decrypt(token)
    return await new Promise(resolve => resolve(null))
  }
}
