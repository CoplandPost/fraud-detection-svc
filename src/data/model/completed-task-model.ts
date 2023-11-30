export class CompletedTaskModel {
  campaign_id: string
  type_task: string
  task_id: string
  total_distance: string
  started_datetime_formatted: string
  arrived_datetime_formatted: string
  completed_datetime: string
  acknowledged_datetime_formatted: string
  reproved_reason?: string
  total_used_time: number
  path: PathModel
}

export class CompletedTaskModelEntity extends CompletedTaskModel {
  id: string
  created_at: string
}

export type PathModel = {
  d_acc: string,
  mock: number,
  gps: number,
  tm_stmp: string,
  bat_lvl: number,
  creation_datetime: string,
  fleet_id: number,
  expiry_date: number,
  longitude: number,
  dist: number,
  latitude: number,
  net: number
}