import { Hono } from 'hono'
import { describeRoute, resolver, validator } from 'hono-openapi'
import z from 'zod'
import { authCheck } from '../../middleware/authCheck.js'
import { NotScrapOwnerError } from '../../services/scraps/error.js'
import { scrapsService } from '../../services/scraps/index.js'
import {
  getScrapsQuerySchema,
  registerScrapSchema,
  scrapSchema,
  updateScrapSchema,
} from './schema.js'

export const scraps = new Hono()
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
        },
      },
    }),
    authCheck,
    validator('json', registerScrapSchema),
    async (c) => {
      const { tagIds, ...data } = c.req.valid('json')
      const userId = c.var.user.userId
      const result = await scrapsService.addScrap(
        {
          userId,
          ...data,
        },
        tagIds,
      )

      if (result.type === 'Failure') {
        return c.json(
          {
            message: result.error.message,
          },
          404,
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
        },
      },
    }),
    authCheck,
    validator('query', getScrapsQuerySchema),
    async (c) => {
      const userId = c.var.user.userId
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
        },
      },
    }),
    authCheck,
    validator('json', updateScrapSchema),
    async (c) => {
      const { scrapId } = c.req.param()
      const date = c.req.valid('json')
      const userId = c.var.user.userId
      const result = await scrapsService.updateScrap(
        scrapId,
        userId,
        {
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
      return c.json(
        {
          message: 'Update successful',
        },
        200,
      )
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
        400: {
          description: 'Bad Request',
        },
        403: {
          description: 'Forbidden',
        },
      },
    }),
    authCheck,
    async (c) => {
      const { scrapId } = c.req.param()
      const userId = c.var.user.userId
      const result = await scrapsService.deleteScrap(scrapId, userId)

      if (result.type == 'Failure') {
        return c.json(
          {
            message: result.error.message,
          },
          result.error instanceof NotScrapOwnerError ? 403 : 400,
        )
      }
      return c.json(
        {
          message: 'Deletion successful',
        },
        200,
      )
    },
  )
