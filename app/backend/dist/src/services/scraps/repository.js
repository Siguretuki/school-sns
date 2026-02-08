import { prisma } from '../../lib/prisma.js';
export const scrapsRepository = {
    getFollowingUserIds: async (userId) => {
        return await prisma.userRelationships.findMany({
            select: { followeeId: true },
            where: { followerId: userId },
        });
    },
    getScraps: async (options = {
        onlyRootScraps: true,
        includeUserInfo: true,
    }) => {
        return await prisma.scraps.findMany({
            where: {
                id: options.ids ? { in: options.ids } : undefined,
                userId: options.userIds ? { in: options.userIds } : undefined,
                parentId: options.onlyRootScraps ? null : undefined,
            },
            take: options.limit,
            skip: options.page && options.limit
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
        });
    },
    getScrapById: async (scrapId) => {
        return await prisma.scraps.findUnique({
            where: { id: scrapId },
            include: {
                scraps: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                userName: true,
                                avatarUrl: true,
                            },
                        },
                    },
                },
                user: {
                    select: {
                        id: true,
                        userName: true,
                        avatarUrl: true,
                    },
                },
                tagScraps: { select: { tagId: true } },
            },
        });
    },
    addScrap: async (content) => {
        return await prisma.scraps.create({
            data: {
                ...content,
            },
        });
    },
    updateScrap: async (scrapId, content) => {
        return await prisma.scraps.update({
            where: { id: scrapId },
            data: {
                ...content,
            },
        });
    },
    isOwnScrap: async (scrapId, userId) => {
        return ((await prisma.scraps.findFirst({
            select: {
                userId: true,
            },
            where: {
                id: scrapId,
                userId,
            },
        })) !== null);
    },
    registerTags: async (scrapId, tagIds) => {
        if (tagIds.length === 0) {
            return;
        }
        const scrapTagData = tagIds.map((tagId) => ({ scrapId, tagId }));
        await prisma.tagScraps.createMany({
            data: scrapTagData,
        });
    },
    updateTags: async (scrapId, tagIds) => {
        if (tagIds.length === 0) {
            await prisma.tagScraps.deleteMany({
                where: { scrapId },
            });
            return;
        }
        const currentTags = (await prisma.tagScraps.findMany({
            where: { scrapId },
            select: { tagId: true },
        })).map(({ tagId }) => tagId);
        const tagsToAdd = tagIds.filter((tagId) => !currentTags.includes(tagId));
        const tagsToRemove = currentTags.filter((tagId) => !tagIds.includes(tagId));
        if (tagsToAdd.length > 0) {
            const scrapTagData = tagsToAdd.map((tagId) => ({ scrapId, tagId }));
            await prisma.tagScraps.createMany({
                data: scrapTagData,
            });
        }
        if (tagsToRemove.length > 0) {
            await prisma.tagScraps.deleteMany({
                where: {
                    scrapId,
                    tagId: { in: tagsToRemove },
                },
            });
        }
    },
    deleteScrap: async (scrapId) => {
        await prisma.scraps.updateMany({
            where: { parentId: scrapId },
            data: { parentId: null },
        });
        await prisma.scraps.delete({
            where: { id: scrapId },
        });
        await prisma.tagScraps.deleteMany({
            where: { scrapId },
        });
    },
    getScrapIdsByTagIds: async (tagIds) => {
        return await prisma.tagScraps.findMany({
            where: { tagId: { in: tagIds } },
            select: { scrapId: true },
        });
    },
};
