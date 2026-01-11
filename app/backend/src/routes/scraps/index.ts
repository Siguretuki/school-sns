import { Hono } from 'hono'
import { describeRoute, resolver, validator } from 'hono-openapi'
import z from 'zod'
import { checkAuth } from '../../middleware/checkAuth.js'
import type { Variables as AuthVariables } from '../../middleware/checkAuth.js'
import { scrapsService } from '../../services/scraps/index.js'
import {
  getScrapsQuerySchema,
  registerScrapSchema,
  scrapSchema,
  updateScrapSchema,
} from './schema.js'

export const scraps = new Hono<{ Variables: AuthVariables }>()
  .post(
    '/',
    describeRoute({
      tags: ['Scraps'],
      description: 'Create a new scrap',
      responses: {
        200: {
          description: 'Successful Response',
          content: {
            'application/json': {
              schema: resolver(scrapSchema),
            },
          },
        },
        500: {
          description: 'Internal Server Error',
          content: {
            'application/json': {
              schema: resolver(
                z.object({
                  message: z.string(),
                }),
              ),
            },
          },
        },
      },
    }),
    checkAuth,
    validator('json', registerScrapSchema),
    async (c) => {
      const date = c.req.valid('json')
      const userId = c.var.userId
      const result = await scrapsService.addScrap(
        {
          title: date.title,
          body: date.body,
          parentId: date.parentId ?? null,
          userId,
        },
        date.tagIds,
      )

      if (result.type === 'Failure') {
        return c.json(
          {
            message: 'Unexpected error occurred while creating scrap.',
          },
          500,
        )
      }
      return c.json(result.value, 200)
    },
  )
  .get(
    '/',
    describeRoute({
      tags: ['Scraps'],
      description: 'Get list of scraps',
      responses: {
        200: {
          description: 'Successful Response',
          content: {
            'application/json': {
              schema: resolver(scrapSchema.array()),
            },
          },
        },
        500: {
          description: 'Internal Server Error',
          content: {
            'application/json': {
              schema: resolver(
                z.object({
                  message: z.string(),
                }),
              ),
            },
          },
        },
      },
    }),
    checkAuth,
    validator('query', getScrapsQuerySchema),
    async (c) => {
      const userId = c.var.userId
      const query = c.req.valid('query')
      const isFollowing = query?.isFollowing

      const result = await scrapsService.getScraps(
        query,
        isFollowing !== undefined && isFollowing ? { userId } : undefined,
      )

      if (result.type === 'Failure') {
        return c.json(
          {
            message: 'Unexpected error occurred while fetching scraps.',
          },
          500,
        )
      }
      return c.json(result.value, 200)
    },
  )
  .get(
    '/:scrapId',
    describeRoute({
      tags: ['Scraps'],
      description: 'Get scrap detail',
      responses: {
        200: {
          description: 'Successful response',
          content: {
            'application/json': {
              schema: resolver(scrapSchema),
            },
          },
        },
        500: {
          description: 'Internal Server Error',
          content: {
            'application/json': {
              schema: resolver(
                z.object({
                  message: z.string(),
                }),
              ),
            },
          },
        },
      },
    }),
    async (c) => {
      const { scrapId } = c.req.param()
      const result = await scrapsService.getScrapById(scrapId)

      if (result.type == 'Failure') {
        return c.json(
          {
            message: 'Unexpected error occurred while fetching scraps.',
          },
          500,
        )
      }
      return c.json(result.value, 200)
    },
  )
  .patch(
    '/:scrapId',
    describeRoute({
      tags: ['Scraps'],
      description: 'Get scrap detail',
      responses: {
        200: {
          description: 'Successful response',
          content: {
            'application/json': {
              schema: resolver(scrapSchema),
            },
          },
        },
        500: {
          description: 'Internal Server Error',
          content: {
            'application/json': {
              schema: resolver(
                z.object({
                  message: z.string(),
                }),
              ),
            },
          },
        },
      },
    }),
    checkAuth,
    validator('json', updateScrapSchema),
    async (c) => {
      const { scrapId } = c.req.param()
      const date = c.req.valid('json')
      const userId = c.var.userId
      const result = await scrapsService.updateScrap(
        scrapId,
        userId,
        {
          title: date.title,
          body: date.body,
        },
        date.tagIds,
      )

      if (result.type == 'Failure') {
        return c.json(
          {
            message: result.error.message,
          },
          403,
        )
      }
      return c.json(result.value, 200)
    },
  )
  .delete(
    '/:scrapId',
    describeRoute({
      tags: ['Scraps'],
      description: 'Get scrap detail',
      responses: {
        200: {
          description: 'Successful response',
          content: {
            'application/json': {
              schema: resolver(
                z.object({
                  message: z.string(),
                }),
              ),
            },
          },
        },
        500: {
          description: 'Internal Server Error',
          content: {
            'application/json': {
              schema: resolver(
                z.object({
                  message: z.string(),
                }),
              ),
            },
          },
        },
      },
    }),
    checkAuth,
    async (c) => {
      const { scrapId } = c.req.param()
      const userId = c.var.userId
      const result = await scrapsService.deleteScrap(scrapId, userId)

      if (result.type == 'Failure') {
        return c.json(
          {
            message: result.error.message,
          },
          500,
        )
      }
      return c.json(
        {
          message: '',
        },
        200,
      )
    },
  )
