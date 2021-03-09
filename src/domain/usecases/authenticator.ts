export interface AuthenticatorModel {
  email: string
  password: string
}

export interface Authenticator {
  auth (authData: AuthenticatorModel): Promise<string>
}
