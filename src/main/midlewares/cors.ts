import { Request, Response, NextFunction } from 'express'

export const cors = (req: Request, res: Response, next: NextFunction): void => {
  res.set('ACCESS-CONTROL-ALLOW-ORIGIN', '*')
  res.set('ACCESS-CONTROL-ALLOW-METHODS', '*')
  res.set('ACCESS-CONTROL-ALLOW-HEADERS', '*')
  next()
}
