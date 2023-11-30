export interface SendBrokerMessage {
  send ({ topic, message }: SendBrokerMessage.Send): Promise<void>
}

export namespace SendBrokerMessage {
  export type Send = {
    topic: string
    message: string
  }
}
