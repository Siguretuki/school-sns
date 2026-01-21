import type { Context, Input, Next } from 'hono'
import { authCookie } from '../lib/authCookie.js'
import { jwt } from '../lib/jwt.js'

export interface Variables {
  userId: string
}

export const checkAuth = async <
  TEnv extends { Variables: Variables },
  TPath extends string,
  TInput extends Input,
>(
  c: Context<TEnv, TPath, TInput>,
  next: Next,
) => {
  const cookie = authCookie.get(c)
  if (cookie === null) {
    return c.json({ message: 'Unauthorized' }, 401)
  }
  const payload = jwt.parse(cookie)
  c.set('userId', payload.sub)
  await next()
}
