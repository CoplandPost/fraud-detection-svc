import request from 'supertest'
import app from '@/main/config/app'

describe('CORS Middleware', () => {
  app.use('/test_cors', (req, res) => {
    res.send()
  })
  test('Should parser body as json', async () => {
    await request(app)
      .get('/test_cors')
      .expect('ACCESS-CONTROL-ALLOW-ORIGIN', '*')
      .expect('ACCESS-CONTROL-ALLOW-METHODS', '*')
      .expect('ACCESS-CONTROL-ALLOW-HEADERS', '*')
  })
})
