import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
import type { JwtVariables } from 'hono/jwt'
import { describeRoute, resolver, validator } from 'hono-openapi'
import { authCookie } from '../../lib/authCookie.js'
import { env } from '../../lib/env.js'
import { authService } from '../../services/auth/service.js'
import type { app } from '../index.js'
import { loginSchema, signupSchema, authResponseSchema } from './schema.js'

type Variables = JwtVariables

const authCheck = jwt({
  secret: env.JWT_SECRET,
  cookie: authCookie.cookieName,
})

export const auth = new Hono<{ Variables: Variables }>()
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
      if (result.type === 'Failure') {
        return c.json({ message: result.error.message }, 409)
      }
      authCookie.set(c, result.value.token)
      return c.json(result.value, 201)
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
      if (result.type === 'Failure') {
        return c.json({ message: result.error.message }, 401)
      }
      authCookie.set(c, result.value.token)
      return c.json(result.value)
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
      authCookie.remove(c)
      authService.logout()
      return c.json({ message: 'Logged out' }, 200)
    },
  )

export type AppType = typeof app
