import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
import type { JwtVariables } from 'hono/jwt'
import { describeRoute, resolver, validator } from 'hono-openapi'
import { authService } from '../../services/auth/service.js'
import type { app } from '../index.js'
import { loginSchema, signupSchema, tokenResponseSchema } from './schema.js'

type Variables = JwtVariables

const authCheck = jwt({ secret: 'it-is-very-secret' })

export const auth = new Hono<{ Variables: Variables }>()
  .post(
    '/signup',
    describeRoute({
      description: 'Signup endpoint',
      responses: {
        200: {
          description: 'Successful Signup',
          content: {
            'application/json': {
              schema: resolver(tokenResponseSchema),
            },
          },
        },
      },
    }),
    validator('json', signupSchema),
    async (c) => {
      const input = c.req.valid('json')
      const result = await authService.signup(input)
      return c.json(result, 201)
    },
  )
  .post(
    '/login',
    describeRoute({
      description: 'Login endpoint',
      responses: {
        200: {
          description: 'Successful Login',
          content: {
            'application/json': {
              schema: resolver(tokenResponseSchema),
            },
          },
        },
      },
    }),
    validator('json', loginSchema),
    async (c) => {
      const input = c.req.valid('json')
      const result = await authService.login(input)
      return c.json(result)
    },
  )
  .post(
    '/logout',
    authCheck,
    describeRoute({
      description: 'Logout endpoint',
      responses: {
        200: {
          description: 'Successful Logout',
        },
      },
    }),
    (c) => {
      authService.logout() // ログアウト処理があれば
      return c.json({ message: 'Logged out' })
    },
  )

export type AppType = typeof app
