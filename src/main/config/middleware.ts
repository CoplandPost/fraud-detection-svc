import { Express } from 'express'
import { bodyParser, cors, contentType } from '../midlewares'
import { noCache } from '../midlewares/no-cache'

export default (app: Express): void => {
  bodyParser(app)
  app.use(cors)
  app.use(contentType)
  app.use(noCache)
}
