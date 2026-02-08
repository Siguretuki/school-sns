import { prisma } from '../../lib/prisma.js';
import { createTestUser } from '../../testing/factories.js';
import { mediaRepository } from './repository.js';
describe('MediaRepository', () => {
    const repo = mediaRepository;
    // テスト用のダミー画像データ生成ヘルパー
    const createAssetData = (userId, suffix) => ({
        userId,
        url: `/uploads/test-${suffix}.png`,
        originalName: `test-${suffix}.png`,
        fileType: 'image/png',
        sizeBytes: 1024n,
    });
    // --- register ---
    describe('register', () => {
        it('MEDIA_REPO_001: 正しい入力値で新しいメディア(Asset)が登録されること', async () => {
            const user = await createTestUser();
            const data = createAssetData(user.id, '1');
            const result = await repo.register(data);
            expect(result.id).toBeDefined();
            expect(result.url).toBe(data.url);
            expect(result.userId).toBe(user.id);
        });
    });
    // --- getUserMedia ---
    describe('getUserMedia', () => {
        it('MEDIA_REPO_002: 指定したユーザーIDに紐づくメディア一覧を取得できること', async () => {
            const user = await createTestUser();
            await repo.register(createAssetData(user.id, '1'));
            await repo.register(createAssetData(user.id, '2'));
            const results = await repo.getUserMedia(user.id);
            expect(results).toHaveLength(2);
            const paths = results.map((r) => r.url);
            expect(paths).toContain(createAssetData(user.id, '1').url);
        });
        it('MEDIA_REPO_003: メディアを持たないユーザーの場合に空配列を返すこと', async () => {
            const user = await createTestUser();
            const results = await repo.getUserMedia(user.id);
            expect(results).toEqual([]);
        });
        it('MEDIA_REPO_004: limitとpageによるページネーションが正しく機能すること', async () => {
            const user = await createTestUser();
            // 3つ作成
            for (let i = 1; i <= 3; i++) {
                await repo.register(createAssetData(user.id, i.toString()));
            }
            const page1 = await repo.getUserMedia(user.id, { page: 1, limit: 1 });
            const page2 = await repo.getUserMedia(user.id, { page: 2, limit: 1 });
            expect(page1).toHaveLength(1);
            expect(page2).toHaveLength(1);
            expect(page1[0].id).not.toBe(page2[0].id);
        });
    });
    // --- deleteMedia ---
    describe('deleteMedia', () => {
        it('MEDIA_REPO_005: 指定したIDのメディアを削除できること', async () => {
            const user = await createTestUser();
            const asset = await repo.register(createAssetData(user.id, 'del'));
            await repo.deleteMedia(asset.id);
            const found = await prisma.assets.findUnique({ where: { id: asset.id } });
            expect(found).toBeNull();
        });
    });
    // --- isOwnMedia ---
    describe('isOwnMedia', () => {
        it('MEDIA_REPO_006: メディアの所有者が一致する場合にtrueを返すこと', async () => {
            const user = await createTestUser();
            const asset = await repo.register(createAssetData(user.id, 'own'));
            const isOwn = await repo.isOwnMedia(asset.id, user.id);
            expect(isOwn).toBe(true);
        });
        it('MEDIA_REPO_007: 所有者が異なる場合にfalseを返すこと', async () => {
            const owner = await createTestUser();
            const other = await createTestUser();
            const asset = await repo.register(createAssetData(owner.id, 'not-mine'));
            const isOwn = await repo.isOwnMedia(asset.id, other.id);
            expect(isOwn).toBe(false);
        });
        it('MEDIA_REPO_008: 存在しないメディアIDの場合にfalseを返すこと', async () => {
            const user = await createTestUser();
            const isOwn = await repo.isOwnMedia('non-existent-id', user.id);
            expect(isOwn).toBe(false);
        });
    });
});
