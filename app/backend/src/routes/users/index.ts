import { Hono } from 'hono'
import { describeRoute, resolver, validator } from 'hono-openapi'
import z from 'zod'
import { authCheck } from '../../middleware/authCheck.js'
import { CannotFollowSelfError } from '../../services/users/error.js'
import { usersService } from '../../services/users/index.js'
import {
  editUserRequestSchema,
  getUserDetailResponseSchema,
  userArtifactsResponseSchema,
  userContentsQuerySchema,
} from './schema.js'

export const users = new Hono()
  .get(
    '/me',
    describeRoute({
      tags: ['Users'],
      description: 'Get current user info',
      responses: {
        200: {
          description: 'Successful Response',
          content: {
            'application/json': {
              schema: resolver(getUserDetailResponseSchema),
            },
          },
        },
        404: {
          description: 'User not found',
        },
      },
    }),
    authCheck,
    async (c) => {
      const userId = c.var.user.userId
      const result = await usersService.getUserDetail(userId)

      if (result.type === 'Failure') {
        return c.json({ message: result.error.message }, 404)
      }
      return c.json(result.value, 200)
    },
  )
  .patch(
    '/me',
    describeRoute({
      tags: ['Users'],
      description: 'Update current user info',
      responses: {
        200: {
          description: 'Successful Response',
          content: {
            'application/json': {
              schema: resolver(getUserDetailResponseSchema),
            },
          },
        },
        500: {
          description: 'Unexpected error occurred',
        },
      },
    }),
    validator('json', editUserRequestSchema),
    authCheck,
    async (c) => {
      const userId = c.var.user.userId
      const input = c.req.valid('json')
      const result = await usersService.editUser(userId, input)

      if (result.type === 'Failure') {
        return c.json(
          {
            message: 'Unexpected error occurred',
          },
          500,
        )
      }
      return c.json(result.value, 200)
    },
  )
  .get(
    '/:userId',
    describeRoute({
      tags: ['Users'],
      description: 'Get user detail by user ID',
      responses: {
        200: {
          description: 'Successful Response',
          content: {
            'application/json': {
              schema: resolver(getUserDetailResponseSchema),
            },
          },
        },
        404: {
          description: 'User not found',
        },
      },
    }),
    async (c) => {
      const { userId } = c.req.param()
      const result = await usersService.getUserDetail(userId)

      if (result.type === 'Failure') {
        return c.json({ message: result.error.message }, 404)
      }
      return c.json(result.value, 200)
    },
  )
  .post(
    '/:userId/follow',
    describeRoute({
      tags: ['Users'],
      description: 'Follow a user by user ID',
      responses: {
        200: {
          description: 'Successful Response',
          content: {
            'application/json': {
              schema: resolver(z.object({ message: z.string() })),
            },
          },
        },
        400: {
          description: 'Cannot follow self',
        },
        409: {
          description: 'Already following the user',
        },
      },
    }),
    authCheck,
    async (c) => {
      const { userId: targetUserId } = c.req.param()
      const userId = c.var.user.userId
      const result = await usersService.followUser(userId, targetUserId)
      if (result.type === 'Failure') {
        return c.json(
          { message: result.error.message },
          result.error instanceof CannotFollowSelfError ? 400 : 409,
        )
      }
      return c.json(
        {
          message: 'Successfully followed the user',
        },
        200,
      )
    },
  )
  .delete(
    '/:userId/follow',
    describeRoute({
      tags: ['Users'],
      description: 'Unfollow a user by user ID',
      responses: {
        200: {
          description: 'Successful Response',
          content: {
            'application/json': {
              schema: resolver(z.object({ message: z.string() })),
            },
          },
        },
      },
    }),
    authCheck,
    async (c) => {
      const { userId: targetUserId } = c.req.param()
      const userId = c.var.user.userId
      await usersService.cancelFollower(userId, targetUserId)
      return c.json(
        {
          message: `Successfully unfollowed the user with ID ${targetUserId}`,
        },
        200,
      )
    },
  )
  .get(
    '/:userId/followers',
    describeRoute({
      tags: ['Users'],
      description: 'Get the list of users who follow the specified user',
      responses: {
        200: {
          description: 'Successful Response',
          content: {
            'application/json': {
              schema: resolver(z.array(getUserDetailResponseSchema)),
            },
          },
        },
        500: {
          description: 'Unexpected error occurred',
        },
      },
    }),
    async (c) => {
      const { userId } = c.req.param()
      const result = await usersService.getFollowers(userId)

      if (result.type === 'Failure') {
        return c.json({ message: 'Unexpected error occurred' }, 500)
      }
      return c.json(result.value, 200)
    },
  )
  .get(
    '/:userId/following',
    describeRoute({
      tags: ['Users'],
      description: 'Get the list of users that the specified user is following',
      responses: {
        200: {
          description: 'Successful Response',
          content: {
            'application/json': {
              schema: resolver(z.array(getUserDetailResponseSchema)),
            },
          },
        },
        500: {
          description: 'Unexpected error occurred',
        },
      },
    }),
    async (c) => {
      const { userId } = c.req.param()
      const result = await usersService.getFollowees(userId)

      if (result.type === 'Failure') {
        return c.json({ message: 'Unexpected error occurred' }, 500)
      }
      return c.json(result.value, 200)
    },
  )
  .get(
    '/:userId/contents',
    describeRoute({
      tags: ['Users'],
      description: 'Get the list of contents created by the specified user',
      responses: {
        200: {
          description: 'Successful Response',
          content: {
            'application/json': {
              schema: resolver(userArtifactsResponseSchema.array()),
            },
          },
        },
        500: {
          description: 'Unexpected error occurred',
        },
      },
    }),
    authCheck,
    validator('query', userContentsQuerySchema),
    async (c) => {
      const { userId } = c.req.param()
      const query = c.req.valid('query')
      const accessUserId = c.var.user.userId

      const result = await usersService.getContentsByUserId(
        userId,
        accessUserId,
        {
          type: query?.type,
        },
      )

      if (result.type === 'Failure') {
        return c.json({ message: 'Unexpected error occurred' }, 500)
      }
      return c.json(result.value, 200)
    },
  )
