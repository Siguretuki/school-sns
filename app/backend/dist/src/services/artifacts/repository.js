import { prisma } from '../../lib/prisma.js';
export const artifactsRepository = {
    getFollowingUserIds: async (userId) => {
        return await prisma.userRelationships.findMany({
            select: { followeeId: true },
            where: { followerId: userId },
        });
    },
    getArtifacts: async (options = {}) => {
        return await prisma.artifacts.findMany({
            where: {
                id: options.ids ? { in: options.ids } : undefined,
                userId: options.userIds ? { in: options.userIds } : undefined,
                publishedAt: {
                    not: null,
                },
            },
            take: options.limit,
            skip: options.page && options.limit
                ? (options.page - 1) * options.limit
                : undefined,
            include: {
                user: {
                    select: {
                        id: true,
                        userName: true,
                        avatarUrl: true,
                    },
                },
            },
        });
    },
    getArtifactById: async (artifactId) => {
        return await prisma.artifacts.findUnique({
            where: { id: artifactId },
            include: {
                user: {
                    select: {
                        id: true,
                        userName: true,
                        avatarUrl: true,
                    },
                },
                tagArtifacts: {
                    select: {
                        tagId: true,
                    },
                },
            },
        });
    },
    addArtifact: async (content) => {
        return await prisma.artifacts.create({
            data: {
                ...content,
            },
        });
    },
    updateArticle: async (artifactId, content) => {
        return await prisma.artifacts.update({
            where: { id: artifactId },
            data: {
                ...content,
            },
        });
    },
    isOwnArtifact: async (artifactId, userId) => {
        return ((await prisma.artifacts.findFirst({
            select: {
                userId: true,
            },
            where: {
                id: artifactId,
                userId,
            },
        })) !== null);
    },
    registerTags: async (artifactId, tagIds) => {
        const artifactTagData = tagIds.map((tagId) => ({ artifactId, tagId }));
        await prisma.tagArtifacts.createMany({
            data: artifactTagData,
        });
    },
    updateTags: async (artifactId, tagIds) => {
        if (tagIds.length === 0) {
            await prisma.tagArtifacts.deleteMany({
                where: { artifactId },
            });
            return;
        }
        const currentTags = (await prisma.tagArtifacts.findMany({
            where: { artifactId },
            select: { tagId: true },
        })).map(({ tagId }) => tagId);
        const tagsToAdd = tagIds.filter((tagId) => !currentTags.includes(tagId));
        const tagsToRemove = currentTags.filter((tagId) => !tagIds.includes(tagId));
        if (tagsToAdd.length > 0) {
            const artifactTagData = tagsToAdd.map((tagId) => ({ artifactId, tagId }));
            await prisma.tagArtifacts.createMany({
                data: artifactTagData,
            });
        }
        if (tagsToRemove.length > 0) {
            await prisma.tagArtifacts.deleteMany({
                where: {
                    artifactId,
                    tagId: { in: tagsToRemove },
                },
            });
        }
    },
    deleteArtifact: async (artifactId) => {
        await prisma.artifacts.delete({
            where: { id: artifactId },
        });
        await prisma.tagArtifacts.deleteMany({
            where: { artifactId },
        });
    },
    getArtifactBodyById: async (artifactId) => {
        const artifact = await prisma.artifacts.findUnique({
            where: { id: artifactId },
            select: { body: true },
        });
        return artifact?.body ?? null;
    },
    getArtifactIdsByTagIds: async (tagIds) => {
        return await prisma.tagArtifacts.findMany({
            where: { tagId: { in: tagIds } },
            select: { artifactId: true },
        });
    },
};
