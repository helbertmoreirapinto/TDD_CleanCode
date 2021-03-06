import { Model } from './model'

export interface AccountModel extends Model{
  name: string
  email: string
  password: string
}
