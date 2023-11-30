import { BrokerEventControllersDecorator } from "@/application/controller/broket-event-controllers-decorator"

export const BrokerEventControllersDecoratorFactory = (topic: string, controller): any => {
  const decorator = new BrokerEventControllersDecorator(controller, topic)
  return decorator
}
