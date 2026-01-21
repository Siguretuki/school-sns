import type { Context } from 'hono'
import { getCookie, setCookie } from 'hono/cookie'
import { env } from './env.js'

const AUTH_COOKIE_NAME = 'token'
const TOKEN_EXPIRATION_SEC = env.TOKEN_EXPIRATION_SEC ?? 60 * 60 * 24

export const authCookie = {
  get: (c: Context): string | null => {
    return getCookie(c, AUTH_COOKIE_NAME) ?? null
  },
  set: (c: Context, token: string) => {
    setCookie(c, AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'Lax',
      path: '/',
      maxAge: TOKEN_EXPIRATION_SEC,
    })
  },
  remove: (c: Context) => {
    setCookie(c, AUTH_COOKIE_NAME, '', {
      httpOnly: true,
      sameSite: 'Lax',
      maxAge: 0,
    })
  },
  cookieName: AUTH_COOKIE_NAME,
}
