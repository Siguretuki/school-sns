import argon2 from 'argon2';
import { prisma } from '../lib/prisma.js';
/**
 * テスト用の共通ユーザー作成関数
 */
export const createTestUser = async (options = {}) => {
    // 指定がなければランダムなメールアドレスを生成
    const email = options.email ?? `test-${crypto.randomUUID()}@example.com`;
    const plainPassword = options.password ?? 'password123';
    const passwordHash = await argon2.hash(plainPassword);
    // authRepo.createUser を使わずに、直接 Prisma で作成
    const user = await prisma.users.create({
        data: {
            email: email,
            userName: options.name ?? `test-${crypto.randomUUID()}-user`,
            passwordHash: passwordHash,
            role: options.role,
        },
    });
    return {
        ...user,
        plainPassword,
    };
};
