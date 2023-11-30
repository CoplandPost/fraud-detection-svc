import { KafkaError } from '@/infra/adapter/kafka/error/kafka-error'
import { BrokerMessageController, EventBrokerController, EventBrokerMessage } from '../contracts/controller'

export class BrokerEventControllersDecorator extends BrokerMessageController {
  constructor (
    private readonly controller: BrokerMessageController,
    private readonly topic: string
  ) { 
    super()
  }

  async perform (request: EventBrokerMessage): EventBrokerController.Result {
    const response = (await (await this.controller.handle(request)))
    if (response?.error) {
      throw new KafkaError(response?.error)
    }
    return null
  }
}
