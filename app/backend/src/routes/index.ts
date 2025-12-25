import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { describeRoute, resolver, validator } from 'hono-openapi'
import z from 'zod'
import { demoQuerySchema, demoResponseSchema } from './schema.js'

export const app = new Hono()
  .use(
    '*',
    cors({
      origin: ['http://localhost:3157'],
    }),
  )
  .get(
    '/',
    describeRoute({
      description: 'Say Hello from Hono',
      responses: {
        200: {
          description: 'Successful Response',
          content: {
            'text/plain': {
              schema: resolver(z.string()),
            },
          },
        },
      },
    }),
    (c) => {
      return c.text('Hello Hono!')
    },
  )
  .get(
    '/demo',
    describeRoute({
      description: 'Demo endpoint',
      responses: {
        200: {
          description: 'Successful Response',
          content: {
            'application/json': {
              schema: resolver(demoResponseSchema),
            },
          },
        },
      },
    }),
    validator('query', demoQuerySchema),
    (c) => {
      const { kind } = c.req.valid('query')
      if (kind === 'positive') {
        return c.json({ message: 'This is a positive message! 😊' })
      } else {
        return c.json({ message: 'This is a negative message! 😞' })
      }
    },
  )

export type AppType = typeof app
