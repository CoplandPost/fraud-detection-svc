export interface DiffDates {
  diff (params: DiffDates.Params): DiffDates.Result
}

export namespace DiffDates {
  export type Params = {
    mainDate: string
    compareDate: string
    considerate: Considerate
  }

  export enum Considerate {
    year = 'year',
    month = 'month',
    hour = 'hour',
    minute = 'minute'
  }

  export type Result = Promise<number>
}
