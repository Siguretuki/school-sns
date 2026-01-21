import type { Assets } from '../../../generated/prisma/client.js'
import { prisma } from '../../lib/prisma.js'
import type { MediaQueryOptions } from './type.js'

export const mediaRepository = {
  register: async (mediaData: Omit<Assets, 'id' | 'createdAt'>) => {
    return await prisma.assets.create({
      data: {
        ...mediaData,
      },
    })
  },
  getUserMedia: async (userId: string, option: MediaQueryOptions = {}) => {
    return await prisma.assets.findMany({
      where: { userId },
      skip:
        option.page && option.limit
          ? (option.page - 1) * option.limit
          : undefined,
      take: option.limit,
    })
  },
  deleteMedia: async (mediaId: string) => {
    return await prisma.assets.delete({
      where: { id: mediaId },
    })
  },
  isOwnMedia: async (mediaId: string, userId: string) => {
    return (
      (await prisma.assets.findFirst({
        select: { id: true },
        where: { id: mediaId, userId },
      })) !== null
    )
  },
}
