import { Hono } from 'hono'
import { describeRoute, resolver, validator } from 'hono-openapi'
import z from 'zod'
import { authCheck } from '../../middleware/authCheck.js'
import { tagsService } from '../../services/tags/index.js'
import {
  addTagSchema,
  getTagsQuerySchema,
  tagSchema,
  updateTagSchema,
} from './schema.js'

export const tags = new Hono()
  .get(
    '/',
    describeRoute({
      tags: ['Tags'],
      description: 'Get list of tags',
      responses: {
        200: {
          description: 'Successful Response',
          content: {
            'application/json': {
              schema: resolver(tagSchema.array()),
            },
          },
        },
        400: {
          description: 'Invalid Query Parameters.',
        },
      },
    }),
    validator('query', getTagsQuerySchema),
    async (c) => {
      const query = c.req.valid('query')
      const result = await tagsService.getTags(query)

      if (result.type === 'Failure') {
        return c.json(
          {
            message: result.error.message,
          },
          400,
        )
      }
      return c.json(result.value, 200)
    },
  )
  .get(
    '/:tagId',
    describeRoute({
      tags: ['Tags'],
      description: 'Get tag by ID',
      responses: {
        200: {
          description: 'Successful Response',
          content: {
            'application/json': {
              schema: resolver(tagSchema),
            },
          },
        },
        404: {
          description: 'Tag Not Found',
        },
      },
    }),
    async (c) => {
      const { tagId } = c.req.param()
      const result = await tagsService.getTagById(tagId)

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
  .post(
    '/',
    describeRoute({
      tags: ['Tags'],
      description: 'Add a new tag',
      responses: {
        200: {
          description: 'Successful Response',
          content: {
            'application/json': {
              schema: resolver(tagSchema),
            },
          },
        },
        409: {
          description: 'Tag name already exists.',
        },
      },
    }),
    validator('json', addTagSchema),
    async (c) => {
      const data = c.req.valid('json')
      const result = await tagsService.addTag(data)

      if (result.type === 'Failure') {
        return c.json(
          {
            message: result.error.message,
          },
          409,
        )
      }
      return c.json(result.value, 200)
    },
  )
  .patch(
    '/:tagId',
    describeRoute({
      tags: ['Tags'],
      description: 'Update a tag',
      responses: {
        200: {
          description: 'Successful Response',
          content: {
            'application/json': {
              schema: resolver(tagSchema),
            },
          },
        },
        404: {
          description: 'Tag Not Found',
        },
      },
    }),
    validator('json', updateTagSchema),
    async (c) => {
      const data = c.req.valid('json')
      const { tagId } = c.req.param()
      const result = await tagsService.updateTag(tagId, data)

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
  .delete(
    '/:tagId',
    describeRoute({
      tags: ['Tags'],
      description: 'Delete a tag',
      responses: {
        200: {
          description: 'Successful Response',
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
        409: {
          description: 'Tag is attached to other resources.',
        },
      },
    }),
    authCheck,
    async (c) => {
      const { tagId } = c.req.param()
      const userId = c.var.user.userId

      const result = await tagsService.deleteTag(tagId, userId)
      if (result.type === 'Failure') {
        return c.json(
          {
            message: result.error.message,
          },
          409,
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
