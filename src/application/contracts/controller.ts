import { ValidatorComposite } from '@/validation/validator/validator-composite'
import { Validation } from './validation'
import { badRequestBrokerMessage, serverErrorBrokerMessage } from '../helper/broker-messge'

export type EventBrokerMessage = {}

export interface EventBrokerController {
  handle (request: EventBrokerMessage): EventBrokerController.Result
}

export namespace EventBrokerController {
  export type Result = Promise<{error: any } | null>
}

export abstract class BrokerMessageController implements EventBrokerController {
  constructor () {}
  abstract perform (request): EventBrokerController.Result
  async handle (request: EventBrokerMessage): EventBrokerController.Result {
    try {
      const error = await this.buildValidator().validate(request)
      console.log(error)
      if (error) throw error 
      const performResponse = await this.perform(request)
      if (performResponse?.error !== undefined) {
        const error = performResponse?.error as string
        throw error
      }
      return performResponse as any
    } catch (error) {
       throw error
    }
  }

  buildValidator (): Validation {
    return new ValidatorComposite([])
  }
}

