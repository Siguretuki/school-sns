import { Result } from '@praha/byethrow'
import {
  AlreadyFollowingError,
  CannotFollowSelfError,
  UserNotFoundError,
} from './error.js'
import { usersRepository } from './repository.js'
import type { EditUserInfo } from './type.js'

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
  getContentsByUserId: async (userId: string) => {
    const contents = await usersRepository.getContentsByUserId(userId)
    return Result.succeed(contents)
  },
}
