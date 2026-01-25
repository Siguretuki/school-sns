import type { Scraps } from '../../../generated/prisma/client.js'
import { prisma } from '../../lib/prisma.js'
import type { ScrapOptions } from './type.js'

export const scrapsRepository = {
  getFollowingUserIds: async (userId: string) => {
    return await prisma.userRelationships.findMany({
      select: { followeeId: true },
      where: { followerId: userId },
    })
  },
  getScraps: async (
    options: ScrapOptions & { ids?: string[]; userIds?: string[] } = {
      onlyRootScraps: true,
      includeUserInfo: true,
    },
  ) => {
    return await prisma.scraps.findMany({
      where: {
        id: options.ids ? { in: options.ids } : undefined,
        userId: options.userIds ? { in: options.userIds } : undefined,
        parentId: options.onlyRootScraps ? null : undefined,
      },
      take: options.limit,
      skip:
        options.page && options.limit
          ? (options.page - 1) * options.limit
          : undefined,
      include: {
        user: options.includeUserInfo
          ? {
              select: {
                id: true,
                userName: true,
                avatarUrl: true,
              },
            }
          : undefined,
      },
    })
  },
  getScrapById: async (scrapId: string) => {
    return await prisma.scraps.findUnique({
      where: { id: scrapId },
    })
  },
  addScrap: async (content: Omit<Scraps, 'id' | 'createdAt' | 'updatedAt'>) => {
    return await prisma.scraps.create({
      data: {
        ...content,
      },
    })
  },
  updateScrap: async (
    scrapId: string,
    content: Partial<
      Omit<Scraps, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'parentId'>
    >,
  ) => {
    return await prisma.scraps.update({
      where: { id: scrapId },
      data: {
        ...content,
      },
    })
  },
  isOwnScrap: async (scrapId: string, userId: string) => {
    return (
      (await prisma.scraps.findFirst({
        select: {
          userId: true,
        },
        where: {
          id: scrapId,
          userId,
        },
      })) !== null
    )
  },
  registerTags: async (scrapId: string, tagIds: string[]) => {
    if (tagIds.length === 0) {
      return
    }

    const scrapTagData = tagIds.map((tagId) => ({ scrapId, tagId }))
    await prisma.tagScraps.createMany({
      data: scrapTagData,
    })
  },
  updateTags: async (scrapId: string, tagIds: string[]) => {
    if (tagIds.length === 0) {
      await prisma.tagScraps.deleteMany({
        where: { scrapId },
      })
      return
    }

    const currentTags = (
      await prisma.tagScraps.findMany({
        where: { scrapId },
        select: { tagId: true },
      })
    ).map(({ tagId }) => tagId)

    const tagsToAdd = tagIds.filter((tagId) => !currentTags.includes(tagId))
    const tagsToRemove = currentTags.filter((tagId) => !tagIds.includes(tagId))

    if (tagsToAdd.length > 0) {
      const scrapTagData = tagsToAdd.map((tagId) => ({ scrapId, tagId }))
      await prisma.tagScraps.createMany({
        data: scrapTagData,
      })
    }

    if (tagsToRemove.length > 0) {
      await prisma.tagScraps.deleteMany({
        where: {
          scrapId,
          tagId: { in: tagsToRemove },
        },
      })
    }
  },
  deleteScrap: async (scrapId: string) => {
    await prisma.scraps.updateMany({
      where: { parentId: scrapId },
      data: { parentId: null },
    })

    await prisma.scraps.delete({
      where: { id: scrapId },
    })
    await prisma.tagScraps.deleteMany({
      where: { scrapId },
    })
  },
  getScrapIdsByTagIds: async (tagIds: string[]) => {
    return await prisma.tagScraps.findMany({
      where: { tagId: { in: tagIds } },
      select: { scrapId: true },
    })
  },
}
