import jwt from 'jsonwebtoken'
import { Decrypter } from '../../../data/protocols/criptography/decrypter'
import { Encrypter } from '../../../data/protocols/criptography/encrypter'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secretKey: string) {}

  async encrypt (id: string): Promise<string> {
    const token = jwt.sign({ id }, this.secretKey)
    return token
  }

  async decrypt (token: string): Promise<string> {
    const value = await jwt.verify(token, this.secretKey)
    if (typeof (value) === 'object') {
      const obj = Object.entries(value)
      return obj[0][1]
    }
    return value
  }
}
