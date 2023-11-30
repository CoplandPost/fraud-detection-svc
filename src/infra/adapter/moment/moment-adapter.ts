import moment, { Moment } from 'moment'
import { GetCurrentDateTime } from '@/data/contracts/moment/get-current-date-time'
import { Format } from '@/data/contracts/moment/format'
import { GetCurrentHour } from '@/data/contracts/moment/get-current-time'
import { AddPeriod } from '@/data/contracts/moment/add-period'
import { FactoryDater } from '@/data/contracts/moment/build'
import { DateType } from '@/data/contracts/moment/date-types'
import { DiffDates } from '@/data/contracts/moment/diff'

export class MomentAdapter implements GetCurrentDateTime, Format, GetCurrentHour, AddPeriod, FactoryDater, DiffDates {
  currentTime: moment.Moment
  constructor (private readonly handledDate?: moment.Moment) {
    this.currentTime = moment()
    this.handledDate = moment()
  }

  getCurrentDateTime (): string {
    return this.currentTime.format('YYYY-MM-DD HH:mm:ss')
  }

  format (format: string): string {
    console.log(format)
    switch (format) {
      case 'YYYY-MM-DD HH:mm:ss':
      case 'DD-MM-YYYY HH:mm:ss':
      case 'DD-MM-YYYY hh:mm:ss':
      case 'YYYY-MM-DD hh:mm:ss':
      case 'DD-MM-YYYY':
      case 'YYYY-MM-DD':
      case 'dddd':
      case 'YYYY':
      case 'YY':
      case 'MM':
      case 'DD':
        return this.handledDate.format(format)

      default:
        throw new Error(`Invalid date format - ${format}`)
    }
  }

  getCurrentHour (format: string): string {
    return this.currentTime.format(format)
  }

  add (params: AddPeriod.AddParam): void {
    this.handledDate.add(params.value, params.period)
  }

  async diff (params: DiffDates.Params): DiffDates.Result {
    const mainDate = moment(params.mainDate)
    const compareDate = moment(params.compareDate)
    const diff = compareDate.diff(mainDate, params.considerate)
    return diff
  }

  factory (): DateType {
    return new MomentAdapter()
  }
}
