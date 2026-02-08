import { prisma } from '../lib/prisma.js';
/**
 * データベースの全テーブルをクリーンアップする
 * 外部キー制約を考慮し、依存関係の深い子テーブルから削除する
 */
export const cleanupDatabase = async () => {
    // トランザクションで一気に実行することで、
    // 万が一途中で失敗しても不整合を防げます
    await prisma.$transaction([
        prisma.oAuthConnection.deleteMany(),
        prisma.comments.deleteMany(),
        prisma.tagScraps.deleteMany(),
        prisma.tagArtifacts.deleteMany(),
        prisma.userRelationships.deleteMany(),
        prisma.artifacts.deleteMany(),
        prisma.scraps.deleteMany(),
        prisma.tags.deleteMany(),
        prisma.users.deleteMany(),
    ]);
};
