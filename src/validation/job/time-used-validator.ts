import { Validation } from "@/application/contracts/validation"
import { MissingParamError, TimeUsedLessThanAllowed } from "@/application/errors"
import { DiffDates } from "@/data/contracts/moment/diff"

export class TimeUsed implements Validation {
  usedTime = 0
  constructor (
    private readonly moment: DiffDates,
    private readonly started_datetime_formatted: string,
    private readonly completed_datetime: string,
    private readonly allowedTime: number,
  ) {}
  async validate(input: any): Promise<Error> {
    if (!input[this.started_datetime_formatted]) return new MissingParamError('started_datetime_formatted')
    if (!input[this.completed_datetime]) return new MissingParamError('completed_datetime')
    const timeUsed = await this.moment.diff({mainDate: input[this.started_datetime_formatted], compareDate: input[this.completed_datetime], considerate: DiffDates.Considerate.minute})
    this.usedTime = timeUsed
    if (timeUsed < this.allowedTime) return new TimeUsedLessThanAllowed(timeUsed, this.allowedTime)
    return null
   }
}