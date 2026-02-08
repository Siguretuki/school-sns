import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { env } from '../lib/env.js';
import { artifacts } from './artifacts/index.js';
import { auth } from './auth/index.js';
import { media } from './media/index.js';
import { scraps } from './scraps/index.js';
import { search } from './search/index.js';
import { tags } from './tags/index.js';
import { users } from './users/index.js';
export const app = new Hono()
    .basePath('/api/v2')
    .use('*', cors({
    origin: [env.ORIGIN_URL],
    credentials: true,
}))
    .route('/auth', auth)
    .route('/users', users)
    .route('/search', search)
    .route('/media', media)
    .route('/artifacts', artifacts)
    .route('/scraps', scraps)
    .route('/tags', tags);
