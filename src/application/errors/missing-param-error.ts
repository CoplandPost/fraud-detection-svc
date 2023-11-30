export class MissingParamError extends Error {
  constructor (param: string) {
    super(`Missing Param error - ${param}`)
    this.name = `MissingParamError`
  }
}