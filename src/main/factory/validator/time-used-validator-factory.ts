import { Validation } from "@/application/contracts/validation";
import { MomentAdapter } from "@/infra/adapter/moment/moment-adapter";
import { TimeUsed } from "@/validation";

export const timeUsedValidatorFactory = (): Validation => {
  const momentAdapter = new MomentAdapter()
  const timeUsed = new TimeUsed(momentAdapter, 'started_datetime_formatted', 'completed_datetime', 5)
  return timeUsed
}