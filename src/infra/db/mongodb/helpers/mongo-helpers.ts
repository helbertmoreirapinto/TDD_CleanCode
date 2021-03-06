import { Collection, MongoClient } from 'mongodb'
import { Model } from '../../../../domain/models/model'

export const MongoHelper = {
  client: null as MongoClient,

  async connect (uri: string): Promise<void> {
    this.client = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  },

  async disconnect (): Promise<void> {
    await this.client.close()
  },

  getCollection (collection: string): Collection {
    return this.client.db().collection(collection)
  },

  map (collection: any): Model {
    const { _id, ...collectionWithouId } = collection
    return Object.assign({}, collectionWithouId, { id: _id })
  }
}
