import { Request, Response, NextFunction } from 'express'
export const noCache = (req: Request, res: Response, next: NextFunction): void => {
  res.set('cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  res.set('expires', '0')
  res.set('surrogate-Control', 'no-store')
  next()
}
