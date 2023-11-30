export default {
  port: process.env.HTTP_PORT ?? 5092,
  MONGO_URI: process.env.MONGO_URI ?? '127.0.0.1',
  kafkaClientId: 'fraude-detection',
  kafkaServerAdress: 'a4353f9ea77ac42648c89e615c69dc70-971290650.us-east-1.elb.amazonaws.com:9094'
}
