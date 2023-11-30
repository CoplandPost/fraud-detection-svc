import { EventBrokerController } from "@/application/contracts/controller";
import { RunJobAssestmentController } from "@/application/controller";
import { makeGuardFactory } from "./data/feature/make-guard-factory";
import { KafkaClientAdapter } from "@/infra/adapter/kafka/kafka-client-adapter";

export const runAssestmentControllerFactory = (): EventBrokerController => {
  const guard = makeGuardFactory()
  const producer = KafkaClientAdapter.createProducer()
  const runAssestmentControllerFactory = new RunJobAssestmentController(guard, producer)
  return runAssestmentControllerFactory
}