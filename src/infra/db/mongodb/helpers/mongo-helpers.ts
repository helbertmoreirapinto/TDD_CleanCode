import { Collection, MongoClient } from 'mongodb'
import { Model } from '../../../../domain/models/model'

export const MongoHelper = {
  client: null as MongoClient,
  url: null as string,

  async connect (url: string): Promise<void> {
    this.url = url
    this.client = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  },

  async disconnect (): Promise<void> {
    await this.client.close()
    this.client = null
  },

  async getCollection (collection: string): Promise<Collection> {
    if (!this.client?.isConnected()) await this.connect(this.url)
    return this.client.db().collection(collection)
  },

  map (collection: any): Model {
    const { _id, ...collectionWithouId } = collection
    return Object.assign({}, collectionWithouId, { id: _id })
  }
}
