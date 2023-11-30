import { SendBrokerMessage } from '@/data/contracts/broker/send-broker-message'
import dev from '@/main/config/dev'
import { Consumer, Kafka, Producer, logLevel } from 'kafkajs'

export type CallBack = {
  topic: string
  partition: number
  value: string
  offset: string
}

type Perform = {
  callback: ({ topic, partition, value, offset }: CallBack) => Promise<void>
  autoCommit: boolean
  topic: string
}
type CreateConsumer = {
  groupId: string
}

type Commit = {
  topic: string
  partition: number
  offset: string
}
export class KafkaClientAdapter implements SendBrokerMessage {
  private static producerConnection: Producer
  private static consumerConnection: Consumer
  private constructor () {}
  private static async producerConnect (): Promise<void> {
    const kafka = new Kafka({
      clientId: dev.kafkaClientId,
      brokers: [dev.kafkaServerAdress]
    })
    if (KafkaClientAdapter.producerConnection === undefined) {
      KafkaClientAdapter.producerConnection = kafka.producer()
    }
    await KafkaClientAdapter.producerConnection.connect()
  }

  private static async consumerConnect ({ groupId }: CreateConsumer): Promise<void> {
    const kafka = new Kafka({
      logLevel: logLevel.NOTHING,
      clientId: dev.kafkaClientId,
      brokers: [dev.kafkaServerAdress]
    })
    if (KafkaClientAdapter.consumerConnection === undefined) {
      KafkaClientAdapter.consumerConnection = kafka.consumer({ groupId })
    }
    await (KafkaClientAdapter.consumerConnection).connect()
  }

  static async createProducer (): Promise<KafkaClientAdapter> {
    await KafkaClientAdapter.producerConnect()
    return new KafkaClientAdapter()
  }

  static async createConsumer ({ groupId }: CreateConsumer): Promise<KafkaClientAdapter> {
    await KafkaClientAdapter.consumerConnect({ groupId })
    return new KafkaClientAdapter()
  }

  async disconnect (): Promise<void> {
    await KafkaClientAdapter.producerConnection.disconnect()
  }

  async send ({ topic, message }: SendBrokerMessage.Send): Promise<void> {
    if (!KafkaClientAdapter.producerConnection) {
      await KafkaClientAdapter.createProducer()
    }

    await KafkaClientAdapter.producerConnection.send({
      topic,
      messages: [{ value: Buffer.from(message) }]
    })
  }

  async perform (consumers: Perform[]): Promise<void> {
    await KafkaClientAdapter.consumerConnection.subscribe({ topics: consumers.map(t => t.topic) })
    KafkaClientAdapter.consumerConnection.on(KafkaClientAdapter.consumerConnection.events.CONNECT, () => {
      console.log('Event Broker Connected!')
    })
    await KafkaClientAdapter.consumerConnection.run({
      autoCommit: false,
      eachBatchAutoResolve: true,
      eachBatch: async ({
        batch,
        resolveOffset,
        heartbeat,
        commitOffsetsIfNecessary,
        uncommittedOffsets,
        isRunning,
        isStale,
        pause
      }) => {
        for (const message of batch.messages) {
          try {
            console.log({
              topic: batch.topic,
              partition: batch.partition,
              highWatermark: batch.highWatermark
            })
            if (!isRunning() || isStale()) break
            try {
              const handledMessage = { value: Buffer.from(message.value).toString(), offset: batch.topic, partition: batch.partition, topic: batch.topic, timestamp: message.timestamp }
              const consume = consumers.filter(c => c.topic === batch.topic)
              if (consume.length > 0) await consume[0].callback(handledMessage)
              resolveOffset(message.offset)
            } catch (error) {
              console.log('ERROR:', error.message)
            }
            await heartbeat()
          } catch (error) {
            // throw new KafkaError(error.message)
          }
        }
      }
    })
  }

  async commit ({ topic, partition, offset }: Commit): Promise<void> {
    await KafkaClientAdapter.consumerConnection.commitOffsets([{ topic, partition, offset: (parseInt(offset) + 1).toString() }])
  }
}
