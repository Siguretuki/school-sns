import type { GoogleUser } from '@hono/oauth-providers/google'
import { getCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'
import { authCookie } from '../lib/authCookie.js'
import { getSession } from '../lib/redis.js'

interface SessionUser {
  userId: string
  role: string
}

export interface Variables {
  'user-google'?: GoogleUser
  user: SessionUser
}

export const authCheck = createMiddleware<{ Variables: Variables }>(
  async (c, next) => {
    const sessionId = getCookie(c, authCookie.cookieName)
    if (!sessionId) {
      return c.json({ message: 'Unauthorized: No session ID' }, 401)
    }

    const session = await getSession<SessionUser>(sessionId)

    if (!session) {
      // Redisにデータがない = 有効期限切れ or 不正なID
      return c.json(
        { message: 'Unauthorized: Invalid or expired session' },
        401,
      )
    }

    c.set('user', session.data)

    await next()
  },
)
