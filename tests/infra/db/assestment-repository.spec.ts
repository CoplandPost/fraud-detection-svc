import { ObjectId } from 'mongodb'
import timekeeper from 'timekeeper'
import { mockJobAssestmentModel } from '../../mock/mock-job-assestment-model'
import { mongoHelper } from '@/infra/adapter/helper/db/mongo'
import { AssestmentRepository } from '@/infra/adapter/db/assestment-repository'

describe('Task Step Repository', () => {
  let collection: any
  const data = mockJobAssestmentModel()
  beforeAll(async () => {
    await mongoHelper.connect()
    collection = await mongoHelper.getCollection('assestment')
  })

  beforeEach(async () => {
    timekeeper.reset()
    await collection.deleteMany({})
  })

  describe('Save', () => {
    it('should save with correct value', async () => {
      const sut = new AssestmentRepository()
      const resp = await sut.save(data) as any
      const mongoResponse = await collection.find({}).toArray()
      expect(mongoResponse[0]).toEqual({ ...data, _id: new ObjectId(resp) })
    })
  })
})
