import { GetCurrentDateTime } from './get-current-date-time'
import { AddPeriod } from './add-period'
import { Format } from './format'
import { GetCurrentHour } from './get-current-time'
import { FactoryDater } from './build'
import { DiffDates } from './diff'

export type DateType = DiffDates & AddPeriod & GetCurrentHour & GetCurrentDateTime & FactoryDater & Format
