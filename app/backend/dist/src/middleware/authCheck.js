import { getCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';
import { authCookie } from '../lib/authCookie.js';
import { getSession } from '../lib/redis.js';
export const authCheck = createMiddleware(async (c, next) => {
    const sessionId = getCookie(c, authCookie.cookieName);
    if (!sessionId) {
        return c.json({ message: 'Unauthorized: No session ID' }, 401);
    }
    const session = await getSession(sessionId);
    if (!session) {
        // Redisにデータがない = 有効期限切れ or 不正なID
        return c.json({ message: 'Unauthorized: Invalid or expired session' }, 401);
    }
    c.set('user', session.data);
    await next();
});
