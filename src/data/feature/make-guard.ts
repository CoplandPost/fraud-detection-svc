import { Validation } from "@/application/contracts/validation"
import { CompletedTaskModel } from "../model/completed-task-model"
import { SaveAssestment } from "../contracts/save-assestment"
import { DistanceValidator, TimeUsed } from "@/validation"

export type Police = (data: CompletedTaskModel) => Promise<Error | null>

type MakeGuard = (validator: Validation[], dbSaveAssestment: SaveAssestment) => Police

export const makeGuard: MakeGuard = (validators, dbSaveAssestment) => async (data): Promise<Error | null> => {
  for (const validator of validators) {
    if (data.type_task === 'collection' && validator instanceof TimeUsed) validator.setAllowedTime(10)
    if (data.type_task === 'collection' && validator instanceof DistanceValidator) validator.setAllowedDistance(1)
    if (data.type_task !== 'collection' && validator instanceof DistanceValidator) validator.setAllowedDistance(3)
    if (data.type_task !== 'collection' && validator instanceof TimeUsed) validator.setAllowedTime(160)
    const error = await validator.validate(data)
    if (validator instanceof TimeUsed) data = { ...data, total_used_time: validator.usedTime}
    if (error) {
      await dbSaveAssestment.save({...data, reproved_reason: error.message})
      return error
    }
  }
  await dbSaveAssestment.save(data)
  return null
}
