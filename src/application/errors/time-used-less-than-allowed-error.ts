export class TimeUsedLessThanAllowed extends Error {
  usedTime = 0
  constructor (time: number, allowedTime: number) {
    super(`Time used is ${time} but less than allowed ${allowedTime}`)
    this.name = `TimeUsedLessThanAllowed`
    this.usedTime = time
  }
}