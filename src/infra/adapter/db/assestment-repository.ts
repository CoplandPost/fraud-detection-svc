import { SaveAssestment } from '@/data/contracts/save-assestment'
import { CompletedTaskModel } from '@/data/model/completed-task-model'
import { ObjectId } from 'mongodb'
import { mongoHelper } from '../helper/db/mongo'

export class AssestmentRepository implements SaveAssestment {
  async save (params: CompletedTaskModel): Promise<null> {
    const repository = await mongoHelper.getCollection('assestment')
    const result = await repository.findOneAndUpdate({
      _id: new ObjectId((params as any).id)
    },
    {
      $set: params
    }, { upsert: true }
    )
    return result.lastErrorObject.upserted?.toString()
  }
}
