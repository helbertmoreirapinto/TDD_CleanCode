import { AccountModel } from '../../../../domain/models/account'

export interface LoadAccountByAccessTokenRepository{
  loadByAccessToken (accessToken: string): Promise<AccountModel>
}
