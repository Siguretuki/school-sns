import { Hono } from 'hono'
import { describeRoute, resolver, validator } from 'hono-openapi'
import type { Assets } from '../../../generated/prisma/client.js'
import { authCheck } from '../../middleware/authCheck.js'
import { mediaService } from '../../services/media/index.js'
import { getMediaQuerySchema, mediaResponseSchema } from './schema.js'

const responseFormatter = (asset: Assets) => ({
  ...asset,
  sizeBytes: Number(asset.sizeBytes),
})

export const media = new Hono()
  .post(
    '/upload',
    describeRoute({
      tags: ['Media'],
      description: 'Upload media file',
      requestBody: {
        description: 'Media file to upload',
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                file: {
                  type: 'string',
                  format: 'binary',
                },
              },
              required: ['file'],
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Successful Response',
          content: {
            'application/json': {
              schema: resolver(mediaResponseSchema),
            },
          },
        },
        400: {
          description: 'Invalid file upload',
        },
        500: {
          description: 'Unexpected error occurred',
        },
      },
    }),
    authCheck,
    async (c) => {
      const body = await c.req.parseBody()
      const file = body.file
      if (typeof file === 'string') {
        return c.json({ error: 'Invalid file upload' }, 400)
      }

      const userId = c.var.user.userId
      const result = await mediaService.upload(userId, file)

      if (result.type === 'Failure') {
        return c.json({ message: 'Unexpected error occurred' }, 500)
      }
      return c.json(responseFormatter(result.value), 200)
    },
  )
  .get(
    '/',
    describeRoute({
      tags: ['Media'],
      description: 'Get user media files with pagination',
      responses: {
        200: {
          description: 'Successful Response',
          content: {
            'application/json': {
              schema: resolver(mediaResponseSchema.array()),
            },
          },
        },
        500: {
          description: 'Unexpected error occurred',
        },
      },
    }),
    authCheck,
    validator('query', getMediaQuerySchema),
    async (c) => {
      const userId = c.var.user.userId
      const query = c.req.valid('query')
      const result = await mediaService.getUserMedia(userId, query)

      if (result.type === 'Failure') {
        return c.json({ message: 'Unexpected error occurred' }, 500)
      }
      return c.json(result.value.map(responseFormatter), 200)
    },
  )
  .delete(
    '/:mediaId',
    describeRoute({
      tags: ['Media'],
      description: 'Delete a media file by ID',
      responses: {
        200: {
          description: 'Media deleted successfully',
        },
        403: {
          description: 'User is not the owner of the media',
        },
      },
    }),
    authCheck,
    async (c) => {
      const userId = c.var.user.userId
      const mediaId = c.req.param('mediaId')
      const result = await mediaService.deleteMedia(mediaId, userId)

      if (result.type === 'Failure') {
        return c.json({ message: result.error.message }, 403)
      }
      return c.json({ message: 'Media deleted successfully' }, 200)
    },
  )
