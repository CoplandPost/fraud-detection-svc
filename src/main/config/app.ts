import express from 'express'
import setupMiddlewares from './middleware'
import { setupBrokerEvents } from '../event-broker/setup-event-broker'

const app = express()
setupMiddlewares(app)
setupBrokerEvents()
export default app
