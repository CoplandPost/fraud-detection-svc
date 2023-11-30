import { MockProxy, mock } from "jest-mock-extended"
import { mockJobAssestmentModel } from "../../mock/mock-job-assestment-model"
import { CompletedTaskModel } from "@/data/model/completed-task-model"
import { Topics } from "@/infra/adapter/kafka/topics/topics"
import { SendBrokerMessage } from "@/data/contracts/broker/send-broker-message"
import { TimeUsedLessThanAllowed } from "@/application/errors"
import { RunJobAssestmentController } from "@/application/controller"

describe('Run Job Assestment Controller', () => {
  let brokerMessage: MockProxy<SendBrokerMessage>
  let guard: jest.Mock
  let data: CompletedTaskModel
  let sut: RunJobAssestmentController

  beforeAll(() => {
    brokerMessage = mock()
    guard = jest.fn().mockResolvedValue(null)
    data = mockJobAssestmentModel()
  });

  beforeEach(() => {
    sut = new RunJobAssestmentController(guard, brokerMessage)
  });
  
  it('should call guard with correct value', async () => {
    await sut.handle(data)
    expect(guard).toHaveBeenCalledWith(data)
  })

  it('should call Broker Message with correct value if Guard returns null', async () => {
    await sut.handle(data)
    expect(brokerMessage.send).toHaveBeenCalledWith({ topic: Topics.IJobCompletedApproved, message: JSON.stringify({taskId: data.task_id, typetask: data.type_task, path: data.path})})
  })

  it('should call Broker Message with correct value if Guard returns error', async () => {
    guard.mockResolvedValueOnce(new TimeUsedLessThanAllowed(10, 20))
    await sut.handle(data)
    expect(brokerMessage.send).toHaveBeenCalledWith({ topic: Topics.IJobCompletedReproved, message: JSON.stringify({taskId: data.task_id, typetask: data.type_task, path: data.path, reproved_reason: new TimeUsedLessThanAllowed(10, 20).message})})
  })
})