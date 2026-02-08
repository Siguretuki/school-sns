import { PrismaClient } from './../../generated/prisma/index.js';
import { env } from './env.js';
const providerType = env.PROVIDER_TYPE === 'sqlserver';
const prisma = (() => {
    if (providerType) {
        const prisma_base = new PrismaClient({});
        return prisma_base.$extends({
            query: {
                users: {
                    async delete({ args }) {
                        const where = args.where;
                        // ID指定がない、または不完全な場合はカスケード制御できないため、そのまま実行してエラーにするか、処理を抜ける
                        if (!where.id) {
                            return prisma_base.users.delete(args);
                        }
                        const userId = where.id;
                        return prisma_base.$transaction(async (tx) => {
                            // 1. 関連データの削除
                            // UserRelationships (フォロー/フォロワー)
                            await tx.userRelationships.deleteMany({
                                where: {
                                    OR: [{ followerId: userId }, { followeeId: userId }],
                                },
                            });
                            // Mentions (メンションされている記録)
                            await tx.mentions.deleteMany({
                                where: { mentionedUserId: userId },
                            });
                            // 2. 本体の削除
                            // query(args) ではなく tx を使うことで、同一トランザクション内で処理を完結させる
                            return await tx.users.delete(args);
                        });
                    },
                },
                scraps: {
                    async delete({ args }) {
                        const where = args.where;
                        if (!where.id) {
                            return prisma_base.scraps.delete(args);
                        }
                        const scrapId = where.id;
                        return prisma_base.$transaction(async (tx) => {
                            // 1. TagScraps (タグ紐付け) を削除
                            await tx.tagScraps.deleteMany({
                                where: { scrapId: scrapId },
                            });
                            // 2. 本体の削除
                            return await tx.scraps.delete(args);
                        });
                    },
                },
            },
        });
    }
    else {
        return new PrismaClient({});
    }
})();
export { prisma };
