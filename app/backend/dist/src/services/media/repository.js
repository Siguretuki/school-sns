import { prisma } from '../../lib/prisma.js';
export const mediaRepository = {
    register: async (mediaData) => {
        return await prisma.assets.create({
            data: {
                ...mediaData,
            },
        });
    },
    getUserMedia: async (userId, option = {}) => {
        return await prisma.assets.findMany({
            where: { userId },
            skip: option.page && option.limit
                ? (option.page - 1) * option.limit
                : undefined,
            take: option.limit,
        });
    },
    deleteMedia: async (mediaId) => {
        return await prisma.assets.delete({
            where: { id: mediaId },
        });
    },
    isOwnMedia: async (mediaId, userId) => {
        return ((await prisma.assets.findFirst({
            select: { id: true },
            where: { id: mediaId, userId },
        })) !== null);
    },
};
