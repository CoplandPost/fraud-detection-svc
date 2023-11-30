export class MissingBrokerMessageParamError extends Error {
  constructor (param: string) {
    super(`Missing Broker Message Param Error - ${param}`)
    this.name = 'MissingBrokerMessageParamError'
  }
}