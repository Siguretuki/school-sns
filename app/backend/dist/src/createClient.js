import { hc } from 'hono/client';
export const createClient = (...params) => hc(...params);
