import type { Artifacts } from '../../../generated/prisma/index.js'
import { prisma } from '../../lib/prisma.js'
import type { ArtifactOptions } from './type.js'

export const artifactsRepository = {
  getFollowingUserIds: async (userId: string) => {
    return await prisma.userRelationships.findMany({
      select: { followeeId: true },
      where: { followerId: userId },
    })
  },
  getArtifacts: async (
    options: ArtifactOptions & {
      ids?: string[]
      userIds?: string[]
      includeDrafts?: boolean
    } = {},
  ) => {
    return await prisma.artifacts.findMany({
      where: {
        id: options.ids ? { in: options.ids } : undefined,
        userId: options.userIds ? { in: options.userIds } : undefined,
        publishedAt: options.includeDrafts ? undefined : { not: null },
      },
      take: options.limit,
      skip:
        options.page && options.limit
          ? (options.page - 1) * options.limit
          : undefined,
      select: {
        id: true,
        title: true,
        summaryByAI: true,
        publishedAt: true,
        status: true,
        user: {
          select: {
            id: true,
            userName: true,
            avatarUrl: true,
          },
        },
        tagArtifacts: {
          select: {
            tag: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })
  },
  getArtifactById: async (artifactId: string) => {
    return await prisma.artifacts.findUnique({
      where: { id: artifactId },
      select: {
        id: true,
        title: true,
        body: true,
        summaryByAI: true,
        publishedAt: true,
        status: true,
        user: {
          select: {
            id: true,
            userName: true,
            avatarUrl: true,
          },
        },
        tagArtifacts: {
          select: {
            tag: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        mentions: {
          select: {
            user: {
              select: {
                id: true,
                userName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    })
  },
  addArtifact: async (
    content: Omit<Artifacts, 'id' | 'createdAt' | 'updatedAt'>,
  ) => {
    return await prisma.artifacts.create({
      data: {
        ...content,
      },
    })
  },
  updateArticle: async (
    artifactId: string,
    content: Partial<
      Omit<Artifacts, 'id' | 'createdAt' | 'updatedAt' | 'userId'>
    >,
  ) => {
    return await prisma.artifacts.update({
      where: { id: artifactId },
      data: {
        ...content,
      },
    })
  },
  isOwnArtifact: async (artifactId: string, userId: string) => {
    return (
      (await prisma.artifacts.findFirst({
        select: {
          userId: true,
        },
        where: {
          id: artifactId,
          userId,
        },
      })) !== null
    )
  },
  registerTags: async (artifactId: string, tagIds: string[]) => {
    const artifactTagData = tagIds.map((tagId) => ({ artifactId, tagId }))
    await prisma.tagArtifacts.createMany({
      data: artifactTagData,
    })
  },
  updateTags: async (artifactId: string, tagIds: string[]) => {
    if (tagIds.length === 0) {
      await prisma.tagArtifacts.deleteMany({
        where: { artifactId },
      })
      return
    }

    const currentTags = (
      await prisma.tagArtifacts.findMany({
        where: { artifactId },
        select: { tagId: true },
      })
    ).map(({ tagId }) => tagId)

    const tagsToAdd = tagIds.filter((tagId) => !currentTags.includes(tagId))
    const tagsToRemove = currentTags.filter((tagId) => !tagIds.includes(tagId))

    if (tagsToAdd.length > 0) {
      const artifactTagData = tagsToAdd.map((tagId) => ({ artifactId, tagId }))
      await prisma.tagArtifacts.createMany({
        data: artifactTagData,
      })
    }

    if (tagsToRemove.length > 0) {
      await prisma.tagArtifacts.deleteMany({
        where: {
          artifactId,
          tagId: { in: tagsToRemove },
        },
      })
    }
  },
  deleteArtifact: async (artifactId: string) => {
    await prisma.artifacts.delete({
      where: { id: artifactId },
    })
    await prisma.tagArtifacts.deleteMany({
      where: { artifactId },
    })
  },
  getArtifactBodyById: async (artifactId: string) => {
    const artifact = await prisma.artifacts.findUnique({
      where: { id: artifactId },
      select: { body: true },
    })
    return artifact?.body ?? null
  },
  getArtifactIdsByTagIds: async (tagIds: string[]) => {
    return await prisma.tagArtifacts.findMany({
      where: { tagId: { in: tagIds } },
      select: { artifactId: true },
    })
  },
}
