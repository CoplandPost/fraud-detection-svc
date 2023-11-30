import { mongoHelper } from './mongo'

const sut = mongoHelper

describe('Mondobb', () => {
  beforeAll(async () => {
    await sut.connect()
  })

  beforeAll(async () => {
    await sut.close
  })

  test('Should reconnect if connection is down', async () => {
    let collection = await sut.getCollection('chat')
    expect(collection).toBeTruthy()
    await sut.close()
    collection = await sut.getCollection('chat')
    expect(collection).toBeTruthy()
  })
})
