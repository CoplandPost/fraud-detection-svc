import { MissingParamError, TimeUsedLessThanAllowed } from "@/application/errors"
import { DiffDates } from "@/data/contracts/moment/diff"
import { TimeUsed } from "@/validation"
import { MockProxy, mock } from 'jest-mock-extended'


describe('Time Used', () => {
  let moment: MockProxy<DiffDates>
  let sut: TimeUsed
  const startDate = '2023-11-29 23:32:32'
  const completedData = '2023-11-29 23:34:50'
  beforeAll(() => {
    moment = mock()
    moment.diff.mockResolvedValue(10)
  })

  beforeEach(() => {
    sut = new TimeUsed(moment, 'started_datetime_formatted', 'completed_datetime', 10)
  })

  it('should return missing param error if not find started_datetime_formatted', async () => {
    const error = await sut.validate({completed_datetime: ''})

    expect(error).toEqual(new MissingParamError('started_datetime_formatted'))
  })

  it('should return missing param error if not find completed_datetime', async () => {
    const error = await sut.validate({started_datetime_formatted: 'value'})

    expect(error).toEqual(new MissingParamError('completed_datetime'))
  })

  it('should call MomentAdapter with correct value', async () => {
    await sut.validate({started_datetime_formatted: startDate, completed_datetime: completedData})
    expect(moment.diff).toHaveBeenCalledWith({mainDate: startDate, compareDate: completedData, considerate: DiffDates.Considerate.minute})
  })


  it('should return null if validator passed', async () => {
    const error = await sut.validate({started_datetime_formatted: 'value', completed_datetime: 'value'})
    expect(error).toBeNull()
  })

  
  it('should return TimeUsedLessThanAllowed', async () => {
    moment.diff.mockResolvedValueOnce(5)
    const error = await sut.validate({started_datetime_formatted: startDate, completed_datetime: completedData})
    expect(error).toEqual(new TimeUsedLessThanAllowed(5, 10))
  })
})