import { Hono } from 'hono'
import { describeRoute, resolver, validator } from 'hono-openapi'
import z from 'zod'
import { authCheck } from '../../middleware/authCheck.js'
import { ArtifactNotFoundError } from '../../services/artifacts/error.js'
import { artifactsService } from '../../services/artifacts/index.js'
import {
  artifactSchema,
  getArtifactsQuerySchema,
  registerArtifactSchema,
  updateArtifactSchema,
} from './schema.js'

export const artifacts = new Hono()
  .post(
    '/',
    describeRoute({
      tags: ['artifacts'],
      description: 'Register a new artifact',
      responses: {
        200: {
          description: 'Successful Response',
          content: {
            'application/json': {
              schema: resolver(artifactSchema),
            },
          },
        },
        500: {
          description: 'Internal Server Error',
        },
      },
    }),
    authCheck,
    validator('json', registerArtifactSchema),
    async (c) => {
      const userId = c.var.user.userId
      const { tagIds, ...data } = c.req.valid('json')

      const result = await artifactsService.addArtifact(
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
      tags: ['artifacts'],
      description: 'Get list of artifacts',
      responses: {
        200: {
          description: 'Successful Response',
          content: {
            'application/json': {
              schema: resolver(artifactSchema.array()),
            },
          },
        },
      },
    }),
    authCheck,
    validator('query', getArtifactsQuerySchema),
    async (c) => {
      const userId = c.var.user.userId
      const query = c.req.valid('query')
      const isFollowing = query?.isFollowing

      const result = await artifactsService.getArtifacts(
        query,
        isFollowing !== undefined
          ? isFollowing
            ? { userId }
            : undefined
          : undefined,
      )

      if (result.type === 'Failure') {
        return c.json(
          {
            message: 'Unexpected error occurred while fetching artifacts.',
          },
          500,
        )
      }
      return c.json(result.value, 200)
    },
  )
  .get(
    '/:artifactId',
    describeRoute({
      tags: ['artifacts'],
      description: 'Get artifact detail',
      responses: {
        200: {
          description: 'Successful response',
          content: {
            'application/json': {
              schema: resolver(artifactSchema),
            },
          },
        },
      },
    }),
    async (c) => {
      const { artifactId } = c.req.param()
      const result = await artifactsService.getArtifactById(artifactId)

      if (result.type == 'Failure') {
        return c.json(
          {
            message: 'Unexpected error occurred while fetching artifacts.',
          },
          500,
        )
      }
      return c.json(result.value, 200)
    },
  )
  .patch(
    '/:artifactId',
    describeRoute({
      tags: ['artifacts'],
      description: 'Get artifact detail',
      responses: {
        200: {
          description: 'Successful response',
          content: {
            'application/json': {
              schema: resolver(z.object({ message: z.string() })),
            },
          },
        },
        403: {
          description: 'Forbidden',
        },
      },
    }),
    authCheck,
    validator('json', updateArtifactSchema),
    async (c) => {
      const { artifactId } = c.req.param()
      const userId = c.var.user.userId
      const { tagIds, ...data } = c.req.valid('json')
      const result = await artifactsService.updateArtifact(artifactId, userId, {
        content: data,
        tagIds,
      })

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
    '/:artifactId',
    describeRoute({
      tags: ['artifacts'],
      description: 'Get artifact detail',
    }),
    authCheck,
    async (c) => {
      const { artifactId } = c.req.param()
      const userId = c.var.user.userId
      const result = await artifactsService.deleteArtifact(artifactId, userId)

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
          message: 'Deletion successful',
        },
        200,
      )
    },
  )
  .post(
    '/:artifactId/summary',
    describeRoute({
      tags: ['artifacts'],
      description: 'Generate AI summary for an artifact',
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
        404: {
          description: 'Artifact not found or summarization failed',
        },
        500: {
          description: 'Internal Server Error',
        },
      },
    }),
    async (c) => {
      const { artifactId } = c.req.param()
      const result = await artifactsService.summarizeArtifact(artifactId)

      if (result.type == 'Failure') {
        return c.json(
          {
            message: result.error.message,
          },
          result.error instanceof ArtifactNotFoundError ? 404 : 500,
        )
      }
      return c.json(
        {
          message: 'AI summary generated successfully.',
        },
        200,
      )
    },
  )
