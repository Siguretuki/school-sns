import { prisma } from '../../lib/prisma.js'

export const searchRepository = {
  findArtifactsByKeyword: async (keyword: string) => {
    return await prisma.artifacts.findMany({
      select: {
        id: true,
        title: true,
      },
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
    })
  },
  findUsersByKeyword: async (keyword: string) => {
    return await prisma.users.findMany({
      select: {
        id: true,
        userName: true,
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
      select: {
        id: true,
        title: true,
      },
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
