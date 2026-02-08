import { authCookie } from '../lib/authCookie.js';
import { jwt } from '../lib/jwt.js';
export const checkAuth = async (c, next) => {
    const cookie = authCookie.get(c);
    if (cookie === null) {
        return c.json({ message: 'Unauthorized' }, 401);
    }
    const payload = jwt.parse(cookie);
    c.set('userId', payload.sub);
    await next();
};
