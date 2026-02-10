import { Result } from '@praha/byethrow'
import z from 'zod'
import { toIsLiked } from '../../lib/formatter.js'
import {
  AlreadyFollowingError,
  CannotFollowSelfError,
  UserNotFoundError,
} from './error.js'
import { usersRepository } from './repository.js'
import type { EditUserInfo } from './type.js'

const userScrapSchema = z.object({
  id: z.string(),
  body: z.string(),
  createdAt: z.union([z.string(), z.date()]),
  updatedAt: z.union([z.string(), z.date()]),
  _count: z.object({
    scraps: z.number(),
    scrapLikes: z.number(),
  }),
  scrapLikes: z.array(z.object({ id: z.string() })),
  user: z.object({
    id: z.string(),
    userName: z.string(),
    avatarUrl: z.string().nullable(),
  }),
})

const userScrapsSchema = z.array(userScrapSchema).optional()

export const usersService = {
  getUserDetail: async (id: string) => {
    const user = await usersRepository.getById(id)
    if (user === null) {
      return Result.fail(new UserNotFoundError(id))
    }
    return Result.succeed(user)
  },
  editUser: async (id: string, input: EditUserInfo) => {
    const updatedUser = await usersRepository.updateById(id, input)
    return Result.succeed(updatedUser)
  },
  followUser: async (userId: string, targetUserId: string) => {
    if (userId === targetUserId) {
      return Result.fail(new CannotFollowSelfError(userId))
    }

    if (await usersRepository.isFollowed(userId, targetUserId)) {
      return Result.fail(new AlreadyFollowingError(userId, targetUserId))
    }

    await usersRepository.followUser(userId, targetUserId)
    return Result.succeed(undefined)
  },
  cancelFollower: async (userId: string, targetUserId: string) => {
    await usersRepository.cancelFollower(userId, targetUserId)
    return Result.succeed(undefined)
  },
  getFollowers: async (userId: string) => {
    const followers = await usersRepository.getFollowers(userId)
    return Result.succeed(followers)
  },
  getFollowees: async (userId: string) => {
    const followees = await usersRepository.getFollowees(userId)
    return Result.succeed(followees)
  },
  getContentsByUserId: async (
    userId: string,
    accessUserId: string,
    options?: {
      type?: 'artifacts' | 'scraps'
      accessUserId?: string
    },
  ) => {
    const contents = await usersRepository.getContentsByUserId(
      userId,
      accessUserId,
      {
        type: options?.type,
        onlyPublished: options?.accessUserId !== userId,
      },
    )
    if (contents === null) {
      return Result.fail(new UserNotFoundError(userId))
    }

    const scrapsResult = userScrapsSchema.safeParse(contents.scraps)
    if (!scrapsResult.success) {
      return Result.fail(new Error('Invalid scrap data'))
    }

    return Result.succeed({
      scraps: scrapsResult.data ? scrapsResult.data.map(toIsLiked) : undefined,
      artifacts: contents.artifacts,
    })
  },
}
