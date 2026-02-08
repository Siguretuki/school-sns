import { prisma } from '../../lib/prisma.js';
export const usersRepository = {
    getById: async (id) => {
        return await prisma.users.findUnique({
            where: { id },
        });
    },
    updateById: async (id, data) => {
        return await prisma.users.update({
            where: { id },
            data: {
                userName: data.userName,
                bio: data.bio,
                avatarUrl: data.avatarUrl,
            },
        });
    },
    followUser: async (userId, targetUserId) => {
        await prisma.userRelationships.create({
            data: {
                followerId: userId,
                followeeId: targetUserId,
            },
        });
    },
    isFollowed: async (userId, targetUserId) => {
        return ((await prisma.userRelationships.findUnique({
            where: {
                followerId_followeeId: {
                    followerId: userId,
                    followeeId: targetUserId,
                },
            },
            select: {
                followerId: true,
            },
        })) !== null);
    },
    cancelFollower: async (userId, targetUserId) => {
        await prisma.userRelationships.deleteMany({
            where: {
                followerId: userId,
                followeeId: targetUserId,
            },
        });
    },
    getFollowers: async (userId) => {
        const followers = await prisma.userRelationships.findMany({
            where: { followeeId: userId },
            include: {
                follower: true,
            },
        });
        return followers.map((relation) => relation.follower);
    },
    getFollowees: async (userId) => {
        const followees = await prisma.userRelationships.findMany({
            where: { followerId: userId },
            include: {
                followee: true,
            },
        });
        return followees.map((relation) => relation.followee);
    },
    getContentsByUserId: async (userId) => {
        const contents = await prisma.artifacts.findMany({
            where: { userId },
        });
        return contents;
    },
};
