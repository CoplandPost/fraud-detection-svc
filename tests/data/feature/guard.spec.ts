import { Validation } from "@/application/contracts/validation"
import { TimeUsedLessThanAllowed } from "@/application/errors"
import { SaveAssestment } from "@/data/contracts/save-assestment"
import { Police, makeGuard } from "@/data/feature/make-guard"
import { CompletedTaskModel } from "@/data/model/completed-task-model"
import { DistanceValidator, SetAllowedTime, TimeUsed } from "@/validation"
import { MockProxy, mock } from "jest-mock-extended"
import { mockJobAssestmentModel } from "../../mock/mock-job-assestment-model"


describe('Guard', () => {
  let dbSaveCompletedTaskAssestment: MockProxy<SaveAssestment>
  let usedTimeValidator: MockProxy<TimeUsed>
  let sut: Police
  let completedTask: CompletedTaskModel = mockJobAssestmentModel()
  beforeAll(() => {
    usedTimeValidator = mock()
    dbSaveCompletedTaskAssestment = mock()
  });

  beforeEach(() => {
    sut = makeGuard([usedTimeValidator], dbSaveCompletedTaskAssestment)
  })

  it('should return null on success', async () => {
    const result = await sut(completedTask)
    expect(result).toBeNull()
  })

  // it.only('should set allowed time 10 minute if validator is TimeUsed if is a collection', async () => {
  //   await sut(completedTask)
  //   expect(usedTimeValidator.setAllowedTime).toHaveBeenCalledWith(10)
  // })

  it('should call DbSaveCompletedTaskAssestment with correct value if validator fails and returns ther error', async () => {
    usedTimeValidator.validate.mockResolvedValueOnce(new TimeUsedLessThanAllowed(10, 30))
    const result = await sut(completedTask)
    expect(dbSaveCompletedTaskAssestment.save).toHaveBeenCalledWith({...completedTask, total_used_time: 10, reproved_reason: new TimeUsedLessThanAllowed(10, 30).message})
    expect(result).toEqual(new TimeUsedLessThanAllowed(10, 30))
  })

  it('should call DbSaveCompletedTaskAssestment with correct value if validator returns null', async () => {
    const result = await sut(completedTask)
    expect(dbSaveCompletedTaskAssestment.save).toHaveBeenCalledWith({...completedTask, total_used_time: 10, reproved_reason: new TimeUsedLessThanAllowed(10, 30).message})
  })
})