import { prisma } from '../../lib/prisma.js';
export const tagsRepository = {
    getTags: async (options) => {
        return await prisma.tags.findMany({
            where: options !== undefined
                ? {
                    tagArtifacts: options.artifactId !== undefined
                        ? {
                            some: {
                                artifactId: options.artifactId,
                            },
                        }
                        : undefined,
                    tagScraps: options.scrapId !== undefined
                        ? {
                            some: {
                                scrapId: options.scrapId,
                            },
                        }
                        : undefined,
                }
                : undefined,
        });
    },
    getTagById: async (tagId) => {
        return await prisma.tags.findUnique({
            where: {
                id: tagId,
            },
        });
    },
    addTag: async (tag) => {
        return await prisma.tags.create({
            data: tag,
        });
    },
    isExistsTagName: async (tagName) => {
        return await prisma.tags.findFirst({
            where: {
                name: { contains: tagName },
            },
        });
    },
    updateTag: async (tagId, data) => {
        return await prisma.tags.update({
            where: {
                id: tagId,
            },
            data,
        });
    },
    isExistsTag: async (tagId) => {
        return ((await prisma.tags.findUnique({
            where: {
                id: tagId,
            },
        })) !== null);
    },
    isExistsTags: async (tagIds) => {
        return ((await prisma.tags.findMany({
            where: {
                id: {
                    in: tagIds,
                },
            },
        })).length === tagIds.length);
    },
    checkAttachedOthersArtifact: async (tagId, userId) => {
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
        });
        for (const { artifact } of artifacts) {
            if (artifact.userId !== userId) {
                return true;
            }
        }
        return false;
    },
    checkAttachedOthersScrap: async (tagId, userId) => {
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
        });
        for (const { scrap } of scraps) {
            if (scrap.userId !== userId) {
                return true;
            }
        }
        return false;
    },
    deleteTag: async (tagId) => {
        await prisma.tags.delete({
            where: {
                id: tagId,
            },
        });
    },
};
