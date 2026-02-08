import { prisma } from '../../lib/prisma.js';
export const authRepository = {
    // メールアドレスでユーザー検索
    findByEmail: async (email) => {
        return await prisma.users.findUnique({
            where: { email },
        });
    },
    findByGoogleId: async (googleId) => {
        return await prisma.users.findFirst({
            where: { googleId },
        });
    },
    updateGoogleId: async (userId, googleId) => {
        return await prisma.users.update({
            where: { id: userId },
            data: { googleId },
        });
    },
    createWithGoogle: async (input) => {
        return await prisma.users.create({
            data: {
                googleId: input.googleId,
                email: input.email,
                userName: input.name ?? 'No Name',
                avatarUrl: input.picture,
            },
        });
    },
    // ユーザー作成
    createUser: async (data) => {
        return await prisma.users.create({
            data: {
                email: data.email,
                passwordHash: data.passwordHash,
                userName: data.name ?? 'No Name',
            },
        });
    },
};
