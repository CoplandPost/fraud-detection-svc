import { Police } from "@/data/feature/make-guard"
import { BrokerMessageController, EventBrokerController } from "../../contracts/controller"
import { SendBrokerMessage } from "@/data/contracts/broker/send-broker-message"
import { CompletedTaskModel } from "@/data/model/completed-task-model"
import { Topics } from "@/infra/adapter/kafka/topics/topics"

export class RunJobAssestmentController extends BrokerMessageController {
  constructor (
    private readonly guard: Police,
    private readonly brokerMessage: SendBrokerMessage
  ) {
    super()
  }
  async perform(request: CompletedTaskModel): EventBrokerController.Result {
    const result = await this.guard(request)
    if (!result) {
      await this.brokerMessage.send({topic: Topics.IJobCompletedApproved, message: JSON.stringify({ taskId: request.task_id, typetask: request.type_task, path: request.path})})
    } else {
      await this.brokerMessage.send({topic: Topics.IJobCompletedReproved, message: JSON.stringify({ taskId: request.task_id, typetask: request.type_task, path: request.path, reproved_reason: result.message})})
    }
    return null
  }
}