import { prisma } from '../../lib/prisma.js'

export const searchRepository = {
  findArtifactsByKeyword: async (keyword: string) => {
    return await prisma.artifacts.findMany({
      where: {
        publishedAt: {
          not: null,
        },
        OR: [
          {
            title: {
              contains: keyword,
            },
          },
          {
            body: {
              contains: keyword,
            },
          },
        ],
      },
      select: {
        id: true,
        title: true,
        summaryByAI: true,
        publishedAt: true,
        user: {
          select: {
            id: true,
            userName: true,
            avatarUrl: true,
          },
        },
      },
    })
  },
  findUsersByKeyword: async (keyword: string) => {
    return await prisma.users.findMany({
      select: {
        id: true,
        userName: true,
        avatarUrl: true,
      },
      where: {
        userName: {
          contains: keyword,
        },
      },
    })
  },
  findScrapsByKeyword: async (keyword: string) => {
    return await prisma.scraps.findMany({
      where: {
        OR: [
          {
            title: {
              contains: keyword,
            },
          },
          {
            body: {
              contains: keyword,
            },
          },
        ],
      },
      select: {
        id: true,
        body: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            scraps: true,
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
    })
  },
  findTagsByKeyword: async (keyword: string) => {
    return await prisma.tags.findMany({
      select: {
        id: true,
        name: true,
      },
      where: {
        name: {
          contains: keyword,
        },
      },
    })
  },
}
