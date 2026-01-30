import type { Tags } from '../../../generated/prisma/sqlserver/index.js'
import { prisma } from '../../lib/prisma.js'
import type { TagQueryOptions } from './type.js'

export const tagsRepository = {
  getTags: async (options?: TagQueryOptions) => {
    return await prisma.tags.findMany({
      where:
        options !== undefined
          ? {
              tagArtifacts:
                options.artifactId !== undefined
                  ? {
                      some: {
                        artifactId: options.artifactId,
                      },
                    }
                  : undefined,
              tagScraps:
                options.scrapId !== undefined
                  ? {
                      some: {
                        scrapId: options.scrapId,
                      },
                    }
                  : undefined,
            }
          : undefined,
    })
  },
  getTagById: async (tagId: string) => {
    return await prisma.tags.findUnique({
      where: {
        id: tagId,
      },
    })
  },
  addTag: async (tag: Omit<Tags, 'id' | 'createdAt' | 'updatedAt'>) => {
    return await prisma.tags.create({
      data: tag,
    })
  },
  isExistsTagName: async (tagName: string) => {
    return await prisma.tags.findFirst({
      where: {
        name: { contains: tagName },
      },
    })
  },
  updateTag: async (
    tagId: string,
    data: Partial<Omit<Tags, 'id' | 'createdAt' | 'updatedAt'>>,
  ) => {
    return await prisma.tags.update({
      where: {
        id: tagId,
      },
      data,
    })
  },
  isExistsTag: async (tagId: string) => {
    return (
      (await prisma.tags.findUnique({
        where: {
          id: tagId,
        },
      })) !== null
    )
  },
  isExistsTags: async (tagIds: string[]) => {
    return (
      (
        await prisma.tags.findMany({
          where: {
            id: {
              in: tagIds,
            },
          },
        })
      ).length === tagIds.length
    )
  },
  checkAttachedOthersArtifact: async (tagId: string, userId: string) => {
    const artifacts = await prisma.tagArtifacts.findMany({
      where: {
        tagId,
      },
      include: {
        artifact: {
          select: {
            userId: true,
          },
        },
      },
    })

    for (const { artifact } of artifacts) {
      if (artifact.userId !== userId) {
        return true
      }
    }
    return false
  },
  checkAttachedOthersScrap: async (tagId: string, userId: string) => {
    const scraps = await prisma.tagScraps.findMany({
      where: {
        tagId,
      },
      include: {
        scrap: {
          select: {
            userId: true,
          },
        },
      },
    })

    for (const { scrap } of scraps) {
      if (scrap.userId !== userId) {
        return true
      }
    }
    return false
  },
  deleteTag: async (tagId: string) => {
    await prisma.tags.delete({
      where: {
        id: tagId,
      },
    })
  },
}
