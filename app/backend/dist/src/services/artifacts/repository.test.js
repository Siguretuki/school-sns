import { describe, it, expect } from 'vitest';
import { prisma } from '../../lib/prisma.js';
import { createTestUser } from '../../testing/factories.js';
import { cleanupDatabase } from '../../testing/setup.js';
import { artifactsRepository } from './repository.js';
describe('ArtifactsRepository', () => {
    const repo = artifactsRepository;
    beforeEach(async () => {
        await cleanupDatabase();
    });
    // --- getFollowingUserIds ---
    describe('getFollowingUserIds', () => {
        it('ARTIFACT_REPO_001: 指定したユーザーがフォローしている全ユーザーのIDを取得できること', async () => {
            const me = await createTestUser();
            const target1 = await createTestUser();
            const target2 = await createTestUser();
            await prisma.userRelationships.createMany({
                data: [
                    { followerId: me.id, followeeId: target1.id },
                    { followerId: me.id, followeeId: target2.id },
                ],
            });
            const results = await repo.getFollowingUserIds(me.id);
            expect(results).toHaveLength(2);
            const ids = results.map((r) => r.followeeId);
            expect(ids).toEqual(expect.arrayContaining([target1.id, target2.id]));
        });
        it('ARTIFACT_REPO_002: フォローしているユーザーがいない場合に空配列を返すこと', async () => {
            const me = await createTestUser();
            const results = await repo.getFollowingUserIds(me.id);
            expect(results).toEqual([]);
        });
    });
    // --- getArtifacts ---
    describe('getArtifacts', () => {
        it('ARTIFACT_REPO_003: 条件なしですべてのアーティファクトを取得できること', async () => {
            const user = await createTestUser();
            await repo.addArtifact({
                title: 'A1',
                body: 'B1',
                userId: user.id,
                summaryByAI: null,
                status: 'DRAFT',
                publishedAt: null,
            });
            await repo.addArtifact({
                title: 'A2',
                body: 'B2',
                userId: user.id,
                summaryByAI: null,
                status: 'DRAFT',
                publishedAt: null,
            });
            const results = await repo.getArtifacts();
            expect(results).toHaveLength(2);
        });
        it('ARTIFACT_REPO_004: limitとpageによるページネーションが正しく機能すること', async () => {
            const user = await createTestUser();
            for (let i = 1; i <= 3; i++) {
                await repo.addArtifact({
                    title: `Art ${i.toString()}`,
                    body: '...',
                    userId: user.id,
                    summaryByAI: null,
                    status: 'DRAFT',
                    publishedAt: null,
                });
            }
            const page1 = await repo.getArtifacts({ page: 1, limit: 1 });
            const page2 = await repo.getArtifacts({ page: 2, limit: 1 });
            expect(page1).toHaveLength(1);
            expect(page2).toHaveLength(1);
            expect(page1[0].id).not.toBe(page2[0].id);
        });
        it('ARTIFACT_REPO_005: 指定したIDリストまたはユーザーIDリストでフィルタリングできること', async () => {
            const u1 = await createTestUser();
            const u2 = await createTestUser();
            const a1 = await repo.addArtifact({
                title: 'U1-A',
                body: '.',
                userId: u1.id,
                summaryByAI: null,
                status: 'DRAFT',
                publishedAt: null,
            });
            await repo.addArtifact({
                title: 'U2-A',
                body: '.',
                userId: u2.id,
                summaryByAI: null,
                status: 'DRAFT',
                publishedAt: null,
            });
            // ID指定
            const resById = await repo.getArtifacts({ ids: [a1.id] });
            expect(resById).toHaveLength(1);
            expect(resById[0].id).toBe(a1.id);
            // UserID指定
            const resByUser = await repo.getArtifacts({ userIds: [u1.id] });
            expect(resByUser).toHaveLength(1);
            expect(resByUser[0].userId).toBe(u1.id);
        });
    });
    // --- getArtifactById ---
    describe('getArtifactById', () => {
        it('ARTIFACT_REPO_006: 指定したIDに一致するアーティファクトを1件取得できること', async () => {
            const user = await createTestUser();
            const created = await repo.addArtifact({
                title: 'T',
                body: 'B',
                userId: user.id,
                summaryByAI: null,
                status: 'DRAFT',
                publishedAt: null,
            });
            const found = await repo.getArtifactById(created.id);
            expect(found?.id).toBe(created.id);
        });
        it('ARTIFACT_REPO_007: 存在しないIDを指定した際にnullを返すこと', async () => {
            const found = await repo.getArtifactById('non-existent-uuid');
            expect(found).toBeNull();
        });
    });
    // --- addArtifact ---
    describe('addArtifact', () => {
        it('ARTIFACT_REPO_008: 正しい入力値で新しいアーティファクトが作成されること', async () => {
            const user = await createTestUser();
            const created = await repo.addArtifact({
                title: 'New',
                body: 'Content',
                userId: user.id,
                summaryByAI: null,
                status: 'DRAFT',
                publishedAt: null,
            });
            expect(created.title).toBe('New');
            expect(created.id).toBeDefined();
        });
    });
    // --- updateArticle ---
    describe('updateArticle', () => {
        it('ARTIFACT_REPO_009: 指定したIDのアーティファクトの内容を更新できること', async () => {
            const user = await createTestUser();
            const art = await repo.addArtifact({
                title: 'Old',
                body: 'Old',
                userId: user.id,
                summaryByAI: null,
                status: 'DRAFT',
                publishedAt: null,
            });
            const updated = await repo.updateArticle(art.id, { title: 'Updated' });
            expect(updated.title).toBe('Updated');
            expect(updated.body).toBe('Old'); // 変更していない部分は維持
        });
    });
    // --- isOwnArtifact ---
    describe('isOwnArtifact', () => {
        it('ARTIFACT_REPO_010: アーティファクトの所有者が一致する場合にtrueを返すこと', async () => {
            const user = await createTestUser();
            const art = await repo.addArtifact({
                title: 'My Art',
                body: '.',
                userId: user.id,
                summaryByAI: null,
                status: 'DRAFT',
                publishedAt: null,
            });
            expect(await repo.isOwnArtifact(art.id, user.id)).toBe(true);
        });
        it('ARTIFACT_REPO_011: 所有者が異なる場合にfalseを返すこと', async () => {
            const owner = await createTestUser();
            const other = await createTestUser();
            const art = await repo.addArtifact({
                title: 'Not Mine',
                body: '.',
                userId: owner.id,
                summaryByAI: null,
                status: 'DRAFT',
                publishedAt: null,
            });
            expect(await repo.isOwnArtifact(art.id, other.id)).toBe(false);
        });
    });
    // --- registerTags ---
    describe('registerTags', () => {
        it('ARTIFACT_REPO_012: アーティファクトに複数のタグを新規登録できること', async () => {
            const user = await createTestUser();
            const art = await repo.addArtifact({
                title: 'T',
                body: 'B',
                userId: user.id,
                summaryByAI: null,
                status: 'DRAFT',
                publishedAt: null,
            });
            const t1 = await prisma.tags.create({ data: { name: 'Tag1' } });
            const t2 = await prisma.tags.create({ data: { name: 'Tag2' } });
            await repo.registerTags(art.id, [t1.id, t2.id]);
            const count = await prisma.tagArtifacts.count({
                where: { artifactId: art.id },
            });
            expect(count).toBe(2);
        });
    });
    // --- updateTags ---
    describe('updateTags', () => {
        it('ARTIFACT_REPO_013: 既存のタグを新しいタグリストで同期（追加・削除）できること', async () => {
            const user = await createTestUser();
            const art = await repo.addArtifact({
                title: 'T',
                body: 'B',
                userId: user.id,
                summaryByAI: null,
                status: 'DRAFT',
                publishedAt: null,
            });
            const tA = await prisma.tags.create({ data: { name: 'A' } });
            const tB = await prisma.tags.create({ data: { name: 'B' } });
            const tC = await prisma.tags.create({ data: { name: 'C' } });
            // 初期状態: A, B
            await repo.registerTags(art.id, [tA.id, tB.id]);
            // 更新: Bを残し、Aを消し、Cを足す
            await repo.updateTags(art.id, [tB.id, tC.id]);
            const current = await prisma.tagArtifacts.findMany({
                where: { artifactId: art.id },
            });
            const ids = current.map((t) => t.tagId);
            expect(ids).toEqual(expect.arrayContaining([tB.id, tC.id]));
            expect(ids).not.toContain(tA.id);
        });
        it('ARTIFACT_REPO_014: タグリストを空にして更新した際に関連する全タグが削除されること', async () => {
            const user = await createTestUser();
            const art = await repo.addArtifact({
                title: 'T',
                body: 'B',
                userId: user.id,
                summaryByAI: null,
                status: 'DRAFT',
                publishedAt: null,
            });
            const t1 = await prisma.tags.create({ data: { name: 'T1' } });
            await repo.registerTags(art.id, [t1.id]);
            await repo.updateTags(art.id, []);
            const count = await prisma.tagArtifacts.count({
                where: { artifactId: art.id },
            });
            expect(count).toBe(0);
        });
    });
    // --- deleteArtifact ---
    describe('deleteArtifact', () => {
        it('ARTIFACT_REPO_015: アーティファクトが削除され関連するタグ情報も削除されること', async () => {
            const user = await createTestUser();
            const art = await repo.addArtifact({
                title: 'T',
                body: 'B',
                userId: user.id,
                summaryByAI: null,
                status: 'DRAFT',
                publishedAt: null,
            });
            const t1 = await prisma.tags.create({ data: { name: 'T1' } });
            await repo.registerTags(art.id, [t1.id]);
            await repo.deleteArtifact(art.id);
            expect(await prisma.artifacts.findUnique({ where: { id: art.id } })).toBeNull();
            // 中間テーブルも消えていること
            expect(await prisma.tagArtifacts.count({ where: { artifactId: art.id } })).toBe(0);
        });
    });
    // --- getArtifactBodyById ---
    describe('getArtifactBodyById', () => {
        it('ARTIFACT_REPO_016: 指定したIDのアーティファクトの本文(body)のみを取得できること', async () => {
            const user = await createTestUser();
            const bodyText = 'This is content body';
            const art = await repo.addArtifact({
                title: 'T',
                body: bodyText,
                userId: user.id,
                summaryByAI: null,
                status: 'DRAFT',
                publishedAt: null,
            });
            const result = await repo.getArtifactBodyById(art.id);
            expect(result).toBe(bodyText);
        });
        it('ARTIFACT_REPO_017: 存在しないIDの本文取得時にnullを返すこと', async () => {
            const result = await repo.getArtifactBodyById('non-existent');
            expect(result).toBeNull();
        });
    });
    // --- getArtifactIdsByTagIds ---
    describe('getArtifactIdsByTagIds', () => {
        it('ARTIFACT_REPO_018: 指定した複数のタグIDを持つアーティファクトのIDリストを取得できること', async () => {
            const user = await createTestUser();
            const art1 = await repo.addArtifact({
                title: 'A1',
                body: 'B',
                userId: user.id,
                summaryByAI: null,
                status: 'DRAFT',
                publishedAt: null,
            });
            const t1 = await prisma.tags.create({ data: { name: 'Tag1' } });
            await repo.registerTags(art1.id, [t1.id]);
            const results = await repo.getArtifactIdsByTagIds([t1.id]);
            expect(results).toHaveLength(1);
            expect(results[0].artifactId).toBe(art1.id);
        });
    });
});
