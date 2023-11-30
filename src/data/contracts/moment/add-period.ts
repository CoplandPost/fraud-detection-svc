export interface AddPeriod {
  add (params: AddPeriod.AddParam): void
}

export namespace AddPeriod {
  export type AddParam = {
    value: number
    period: AddPeriod.Period
  }

  export enum Period {
    month = 'month',
    day = 'day',
    year = 'year',
    hour = 'hour',
    minute = 'minute'
  }
}
