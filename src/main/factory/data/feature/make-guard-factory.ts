import { Police, makeGuard } from "@/data/feature/make-guard";
import { AssestmentRepository } from "@/infra/adapter/db/assestment-repository";
import { DistanceValidator, TimeUsed } from "@/validation";
import { timeUsedValidatorFactory } from "../../validator/time-used-validator-factory";

export const makeGuardFactory = (): Police => {
  const assestmentRepository = new AssestmentRepository()
  const validators = [
    timeUsedValidatorFactory(),
    new DistanceValidator('total_distance', 3)
  ]
  const makeGuards = makeGuard(validators, assestmentRepository)
  return makeGuards
}