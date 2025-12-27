import { Hono } from 'hono'
import type { Context } from 'hono'
import { setCookie } from 'hono/cookie'
import { jwt } from 'hono/jwt'
import type { JwtVariables } from 'hono/jwt'
import { describeRoute, resolver, validator } from 'hono-openapi'
import {
  authService,
  EmailAlreadyExistsError,
  InvalidCredentialsError,
} from '../../services/auth/service.js'
import type { app } from '../index.js'
import { loginSchema, signupSchema, authResponseSchema } from './schema.js'

type Variables = JwtVariables
const JWT_SECRET = process.env.JWT_SECRET ?? 'it-is-very-secret'
const TOKEN_EXPIRATION_SEC =
  Number(process.env.TOKEN_EXPIRATION_SEC) || 60 * 60 * 24

const authCheck = jwt({
  secret: JWT_SECRET,
  cookie: 'token',
})
const setAuthCookie = (c: Context, token: string) => {
  setCookie(c, 'token', token, {
    httpOnly: true,
    sameSite: 'Lax',
    path: '/',
    maxAge: TOKEN_EXPIRATION_SEC,
  })
}

export const auth = new Hono<{ Variables: Variables }>()
  .onError((err, c) => {
    // 1. メールアドレス重複エラー (409 Conflict または 400 Bad Request)
    if (err instanceof EmailAlreadyExistsError) {
      return c.json({ message: err.message }, 409)
    }

    // 2. 認証失敗エラー (401 Unauthorized)
    if (err instanceof InvalidCredentialsError) {
      return c.json({ message: err.message }, 401)
    }

    // 3. それ以外の予期せぬエラー (500)
    console.error(err)
    return c.json({ message: 'Internal Server Error' }, 500)
  })
  .post(
    '/signup',
    describeRoute({
      tags: ['Auth'],
      description: 'Signup endpoint',
      responses: {
        200: {
          description: 'Successful Signup',
          content: {
            'application/json': {
              schema: resolver(authResponseSchema),
            },
          },
        },
        409: {
          description: 'Email already exists',
        },
      },
    }),
    validator('json', signupSchema),
    async (c) => {
      const input = c.req.valid('json')
      const result = await authService.signup(input)
      setAuthCookie(c, result.token)
      return c.json(result, 201)
    },
  )
  .post(
    '/login',
    describeRoute({
      tags: ['Auth'],
      description: 'Login endpoint',
      responses: {
        200: {
          description: 'Successful Login',
          content: {
            'application/json': {
              schema: resolver(authResponseSchema),
            },
          },
        },
        401: {
          description: 'Invalid email or password',
        },
      },
    }),
    validator('json', loginSchema),
    async (c) => {
      const input = c.req.valid('json')
      const result = await authService.login(input)
      setAuthCookie(c, result.token)
      return c.json(result)
    },
  )
  .post(
    '/logout',
    authCheck,
    describeRoute({
      tags: ['Auth'],
      description: 'Logout endpoint',
      responses: {
        200: {
          description: 'Successful Logout',
        },
      },
    }),
    (c) => {
      setCookie(c, 'token', '', {
        httpOnly: true,
        path: '/',
        maxAge: 0, // 即座に期限切れにする
      })
      authService.logout()
      return c.json({ message: 'Logged out' })
    },
  )

export type AppType = typeof app
