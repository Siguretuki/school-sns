import { prisma } from '../../lib/prisma.js'
import type { EditUserInfo } from './type.js'

export const usersRepository = {
  getById: async (id: string) => {
    return await prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        userName: true,
        bio: true,
        avatarUrl: true,
        _count: {
          select: {
            userFolloweeRelationships: true,
            userFollowerRelationships: true,
            artifacts: true,
          },
        },
      },
    })
  },
  updateById: async (id: string, data: EditUserInfo) => {
    return await prisma.users.update({
      where: { id },
      data: {
        userName: data.userName,
        bio: data.bio,
        avatarUrl: data.avatarUrl,
      },
    })
  },
  followUser: async (userId: string, targetUserId: string) => {
    await prisma.userRelationships.create({
      data: {
        followerId: userId,
        followeeId: targetUserId,
      },
    })
  },
  isFollowed: async (userId: string, targetUserId: string) => {
    return (
      (await prisma.userRelationships.findUnique({
        where: {
          followerId_followeeId: {
            followerId: userId,
            followeeId: targetUserId,
          },
        },
        select: {
          followerId: true,
        },
      })) !== null
    )
  },
  cancelFollower: async (userId: string, targetUserId: string) => {
    await prisma.userRelationships.deleteMany({
      where: {
        followerId: userId,
        followeeId: targetUserId,
      },
    })
  },
  getFollowers: async (userId: string) => {
    const followers = await prisma.userRelationships.findMany({
      where: { followeeId: userId },
      include: {
        follower: true,
      },
    })
    return followers.map((relation) => relation.follower)
  },
  getFollowees: async (userId: string) => {
    const followees = await prisma.userRelationships.findMany({
      where: { followerId: userId },
      include: {
        followee: true,
      },
    })
    return followees.map((relation) => relation.followee)
  },
  getContentsByUserId: async (
    targetUserId: string,
    accessUserId: string,
    options?: {
      type?: 'scraps' | 'artifacts'
      onlyPublished?: boolean
    },
  ) => {
    return await prisma.users.findFirst({
      where: { id: targetUserId },
      select: {
        scraps:
          options?.type === undefined || options.type === 'scraps'
            ? {
                select: {
                  id: true,
                  body: true,
                  title: true,
                  createdAt: true,
                  updatedAt: true,
                  _count: {
                    select: {
                      scraps: true,
                      scrapLikes: true,
                    },
                  },
                  scrapLikes: {
                    where: {
                      userId: accessUserId,
                    },
                    select: {
                      id: true,
                    },
                  },
                  user: {
                    select: {
                      id: true,
                      userName: true,
                      avatarUrl: true,
                    },
                  },
                },
              }
            : undefined,
        artifacts: options?.type === undefined || options.type === 'artifacts',
      },
    })
  },
}
