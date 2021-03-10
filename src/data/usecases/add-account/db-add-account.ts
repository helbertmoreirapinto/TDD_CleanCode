import { AddAccount, AddAccountModel, AccountModel, Hasher, AddAccountRepository } from './db-add-account-protocols'
export class DbAddAccount implements AddAccount, AddAccountRepository {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository
  ) {}

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(accountData.password)
    const account = await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }))
    return account
  }
}
