import dev from '@/main/config/dev'
import { MongoClient } from 'mongodb'

export const mongoHelper = {
  connection: null,
  isConnected: false,
  async connect () {
    try {
      this.connection = await MongoClient.connect(dev.MONGO_URI !== '127.0.0.1' ? `mongodb://${dev.MONGO_URI}/assestment` : global.__MONGO_URI__)
      this.isConnected = true
    } catch (err) {
      console.log(err)
      this.isConnected = false
    }
  },
  async close () {
    await this.connection.close()
    this.connection = null
    this.isConnected = false
  },
  async getCollection (name) {
    if (!this.isConnected) {
      await this.connect()
    }
    return await this.connection.db().collection(name)
  },
  map (data, idname?) {
    const { _id, ...dataWithoudId } = data
    const idPropertieName = idname ?? 'id'
    return { ...dataWithoudId, [idPropertieName]: _id.toString() }
  },
  mapCollection (collection, idname?) {
    return collection.map(c => mongoHelper.map(c, idname))
  }
}
