import { Police } from "@/data/feature/make-guard"
import { BrokerMessageController, EventBrokerController } from "../../contracts/controller"
import { SendBrokerMessage } from "@/data/contracts/broker/send-broker-message"
import { CompletedTaskModel } from "@/data/model/completed-task-model"
import { Topics } from "@/infra/adapter/kafka/topics/topics"
import { Validation } from "@/application/contracts/validation"
import { ValidatorComposite } from "@/validation/validator/validator-composite"
import { RequiredFieldValidator } from "@/validation/validator/required-field-validator"

export class RunJobAssestmentController extends BrokerMessageController {
  constructor (
    private readonly guard: Police,
    private readonly brokerMessage: Promise<SendBrokerMessage>
  ) {
    super()
  }
  async perform(request: CompletedTaskModel): EventBrokerController.Result {
    const result = await this.guard(request)
    if (!result) {
      setTimeout(async () => await (await this.brokerMessage).send({topic: Topics.IJobCompletedApproved, message: JSON.stringify({ taskId: request.task_id, typetask: request.type_task, path: request.path})}), 5000);
    } else {
      setTimeout(async () => await (await this.brokerMessage).send({topic: Topics.IJobCompletedReproved, message: JSON.stringify({ taskId: request.task_id, typetask: request.type_task, path: request.path, reproved_reason: result.message})}), 5000)
    }
    return null
  }

  buildValidator(): Validation<Promise<Error>> {
    return new ValidatorComposite([
      new RequiredFieldValidator('campaign_id'),
      new RequiredFieldValidator('task_id'),
      new RequiredFieldValidator('type_task'),
    ])
  }
}