import { BrokerMessageController } from "@/application/contracts/controller"

type Event = {
  topic: string
  value: string
  partition: number
  offset: string
}

export const messageCallBackAdapter = (controller: BrokerMessageController): any =>
  async ({ topic, value, partition, offset }: Event): Promise<void> => {
    console.log(`Broker Event: ${topic}`, value)
    let body
    try {
      body = JSON.parse(value)
    } catch {
      body = value
    }
    await controller.handle(body)
  }
