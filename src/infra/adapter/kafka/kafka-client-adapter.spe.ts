import { CallBack, KafkaClientAdapter } from './kafka-client-adapter'

const producerSender = jest.fn()

const producer = jest.fn().mockReturnValue({
  connect: jest.fn(),
  send: producerSender
})

const consumerConnect = jest.fn()
const consumerRun = jest.fn()
const subscribe = jest.fn()
const commitOffsets = jest.fn()

const consumer = jest.fn().mockReturnValue({
  connect: consumerConnect,
  subscribe,
  run: consumerRun,
  commitOffsets,
  events: {
    CONNECT: 'CONNECT'
  },
  on: jest.fn()
})

jest.mock('kafkajs', () => {
  return {
    Kafka: jest.fn().mockReturnValue({
      producer: () => producer(),
      consumer: (arg) => consumer(arg)
    }),
    logLevel: { NOTHING: 0, ERROR: 1, WARN: 2, INFO: 4, DEBUG: 5 }
  }
})

describe('Kafka Client', () => {
  let sut: KafkaClientAdapter
  beforeAll(async () => {
    consumerRun.mockImplementation(async ({ autoComit, eachMessage }) => {
      await eachMessage({ topic: 'any_topic', partition: 1, message: { timestamp: '10202', offset: '20', value: "{ prop: 'any_prop_value'}" } })
    })
    sut = await KafkaClientAdapter.createProducer()
  })
  beforeEach(() => {
    consumerRun.mockClear()
  })
  it('Should call producer once', async () => {
    await sut.send({ topic: 'any_topic', message: 'any_message' })

    expect(producer).toHaveBeenCalled()
  })
  it('Should call sender with correct value', async () => {
    await sut.send({ topic: 'any_topic', message: 'any_message' })

    expect(producerSender).toHaveBeenCalled()
    expect(producerSender).toHaveBeenCalledWith({ topic: 'any_topic', messages: [{ value: Buffer.from('any_message') }] })
  })

  it('Should call consumer once', async () => {
    const sut = await KafkaClientAdapter.createConsumer({ groupId: 'any_group' })

    await sut.perform([{ callback: async ({ topic, partition, value, offset }: CallBack): Promise<void> => {}, topic: 'any_topic', autoCommit: false }])

    expect(consumer).toHaveBeenCalled()
    expect(consumer).toHaveBeenCalledWith({ groupId: 'any_group' })
  })
  it('Should call subscribe with correct value', async () => {
    const sut = await KafkaClientAdapter.createConsumer({ groupId: 'any_group' })

    await sut.perform([{ callback: async ({ topic, partition, value, offset }: CallBack): Promise<void> => {}, topic: 'any_topic', autoCommit: false }])

    expect(subscribe).toHaveBeenCalled()
    expect(subscribe).toHaveBeenCalledWith({ topics: ['any_topic'] })
  })
  it('Should call run with correct values', async () => {
    const sut = await KafkaClientAdapter.createConsumer({ groupId: 'any_group' })

    await sut.perform([{ callback: async ({ topic, partition, value, offset }: CallBack): Promise<void> => {}, topic: 'any_topic', autoCommit: false }])

    expect(consumerRun).toHaveBeenCalled()
    expect(consumerRun.mock.calls[0][0]).toMatchObject({ autoCommit: false })
  })
  it('Should call callback with correct message', async () => {
    const callback = jest.fn()
    const sut = await KafkaClientAdapter.createConsumer({ groupId: 'any_group' })

    await sut.perform([{ callback, topic: 'any_topic', autoCommit: false }])

    expect(callback).toHaveBeenCalled()
    expect(callback).toHaveBeenCalledWith({ value: "{ prop: 'any_prop_value'}", timestamp: '10202', offset: '20', topic: 'any_topic', partition: 1 })
  })

  it('Should call commit with correct values', async () => {
    const sut = await KafkaClientAdapter.createConsumer({ groupId: 'any_group' })

    await sut.commit({ topic: 'new_customer', partition: 2, offset: '67' })

    expect(commitOffsets).toHaveBeenCalled()
    expect(commitOffsets).toHaveBeenCalledWith([{ topic: 'new_customer', partition: 2, offset: '68' }])
  })
})
