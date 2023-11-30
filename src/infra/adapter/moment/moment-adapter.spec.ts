import timekeeper from 'timekeeper'
import { GetCurrentDateTime } from '@/data/contracts/moment/get-current-date-time'
import { MomentAdapter } from './moment-adapter'
import { Format } from '@/data/contracts/moment/format'
import { GetCurrentHour } from '@/data/contracts/moment/get-current-time'
import { AddPeriod } from '@/data/contracts/moment/add-period'
import { FactoryDater } from '@/data/contracts/moment/build'
import { DiffDates } from '@/data/contracts/moment/diff'

type SutTypes = {
  sut: GetCurrentDateTime & Format & GetCurrentHour & AddPeriod & FactoryDater & DiffDates
}

const makeSut = (): SutTypes => {
  const sut = new MomentAdapter()
  return { sut }
}

const mockedAddPeriod = jest.fn()
const mockedFormat = jest.fn().mockReturnValue('2023-02-02 00:00:00')
// jest.mock('moment', () => {
//   return {
//     __esModule: true,
//     default: function () {
//       return {
//         add: (value: number, period: string) => mockedAddPeriod(value, period),
//         format: (format: string) => mockedFormat(format)
//       }
//     }
//   }
// })

describe('Moment Adapter', () => {
  afterEach(() => {
    timekeeper.reset()
    mockedFormat.mockClear()
  })
  describe('getCurrentTime()', () => {
    test('Should return correct date', async () => {
      const mockDate = '2023-02-02 00:00:00'
      const { sut } = makeSut()
      expect(sut.getCurrentDateTime()).toBe(mockDate)
    })

    test('Should throw if moment fails', async () => {
      const { sut } = makeSut()
      mockedFormat.mockImplementationOnce(() => {
        throw new Error('')
      })
      expect(() => sut.getCurrentDateTime()).toThrow()
    })
  })

  describe('format()', () => {
    test('Should return only year', async () => {
      mockedFormat
        .mockReturnValueOnce('2023')
        .mockReturnValueOnce('23')
      const { sut } = makeSut()
      expect(sut.format('YYYY')).toBe('2023')
      expect(sut.format('YY')).toBe('23')
    })

    test('Should return only month', async () => {
      mockedFormat
        .mockReturnValueOnce('02')
      const { sut } = makeSut()
      expect(sut.format('MM')).toBe('02')
      expect(mockedFormat).toHaveBeenCalledWith('MM')
    })

    test('Should return only day', async () => {
      mockedFormat
        .mockReturnValueOnce('02')
      const { sut } = makeSut()
      expect(sut.format('DD')).toBe('02')
      expect(mockedFormat).toHaveBeenCalledWith('DD')
    })

    test('Should return name day of week', async () => {
      mockedFormat
        .mockReturnValueOnce('Sunday')
      const { sut } = makeSut()
      expect(sut.format('dddd')).toBe('Sunday')
    })

    test.only('Should return full date', async () => {
      timekeeper.freeze('01-10-2023')
      const { sut } = makeSut()
      expect(sut.format('YYYY-MM-DD')).toBe('2023-01-10')
      expect(sut.format('DD-MM-YYYY')).toBe('10-01-2023')
    })

    test('Should throw if is invalid param', async () => {
      const { sut } = makeSut()
      expect(() => sut.format('FF')).toThrow('Invalid date param')
    })

    test('Should throw if moment fails', async () => {
      const { sut } = makeSut()
      mockedFormat.mockImplementationOnce(() => {
        throw new Error('')
      })
      expect(() => sut.format('DD')).toThrow()
      expect(mockedFormat).toHaveBeenCalledWith('DD')
    })
  })

  describe('Diff', () => {
    test.only('Should return full date', async () => {
      timekeeper.freeze('01-10-2023')
      const { sut } = makeSut()
      expect(await sut.diff({
        mainDate: '10-01-2023 10:00:00',
        compareDate: '10-01-2023 11:00:00',
        considerate: DiffDates.Considerate.minute
      })).toBe(60)
      // expect(sut.diff('DD-MM-YYYY')).toBe('10-01-2023')
    })
  })

  describe('current hour', () => {
    test('Should return only year', async () => {
      mockedFormat
        .mockReturnValueOnce('12')
      const { sut } = makeSut()
      expect(sut.getCurrentHour('HH')).toBe('12')
    })
  })

  describe('addPeriod', () => {
    test('Should call moment with correct value', async () => {
      const { sut } = makeSut()
      sut.add({ value: 1, period: AddPeriod.Period.day })
      expect(mockedAddPeriod).toHaveBeenCalledWith(1, AddPeriod.Period.day)
    })
  })

  describe('factory', () => {
    test('Should call return correct value', async () => {
      const { sut } = makeSut()
      expect(sut.factory()).toBeInstanceOf(MomentAdapter)
    })
  })
})
