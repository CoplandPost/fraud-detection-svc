export class KafkaError extends Error {
  constructor (error: string) {
    super(`Kafka fails - ${error}`)
    this.name = 'KafkaError'
  }
}
