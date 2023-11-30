import parser from 'body-parser'

export const bodyParser = (app: any): void => {
  app.use(parser.json({ limit: '25mb' }))
  app.use(parser.urlencoded({ limit: '25mb', extended: true }))
}
