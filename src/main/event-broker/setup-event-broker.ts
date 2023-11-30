import { KafkaClientAdapter } from '@/infra/adapter/kafka/kafka-client-adapter'
import { messageCallBackAdapter } from '@/infra/adapter/kafka/message-callback-adapter'
import { Topics } from '@/infra/adapter/kafka/topics/topics'
import dev from '../config/dev'
import { BrokerEventControllersDecoratorFactory } from '../factory/controller-decorator-factory'
import { runAssestmentControllerFactory } from '../factory/run-assestment-controller-factory'


export const setupBrokerEvents = async (): Promise<void> => {
  try {
    const consumer = await KafkaClientAdapter.createConsumer({ groupId: dev.kafkaClientId })
    const subscribers = []
    for (const eventTrigger of eventTriggers) {
      subscribers.push({ callback: eventTrigger.callback, topic: eventTrigger.topic, autoCommit: false })
    }
    await consumer.perform(subscribers)
  } catch (error) {
    console.log(error)
  }
}

const eventTriggers = [
  {
    topic: Topics.IProviderCompletedTask,
    callback: messageCallBackAdapter(BrokerEventControllersDecoratorFactory(Topics.IProviderCompletedTask, runAssestmentControllerFactory()))
  },
  
]
