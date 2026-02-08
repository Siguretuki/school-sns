import { prisma } from '../../lib/prisma.js';
import { createTestUser } from '../../testing/factories.js';
import { cleanupDatabase } from '../../testing/setup.js';
import { TagNotFoundError } from '../tags/error.js';
import { NotScrapOwnerError, ScrapNotFoundError } from './error.js';
import { scrapsService } from './index.js';
describe('ScrapsService', () => {
    // テスト実行ごとにデータベースをクリーンアップ
    beforeEach(async () => {
        await cleanupDatabase();
    });
    describe('getScraps', () => {
        // フィルタ条件なしでルート要素のみが取得されるか検証
        it('SCRAPS_SERVICE_001: 条件指定なしでスクラップ一覧が取得できること（デフォルトでルート要素のみ）', async () => {
            const user = await createTestUser();
            // ルート要素 (parentId: null)
            await prisma.scraps.create({
                data: {
                    title: 'Root Scrap',
                    body: 'Body',
                    userId: user.id,
                    parentId: null,
                },
            });
            // 子要素
            const parent = await prisma.scraps.create({
                data: {
                    title: 'Parent',
                    body: 'Body',
                    userId: user.id,
                },
            });
            await prisma.scraps.create({
                data: {
                    title: 'Child Scrap',
                    body: 'Body',
                    userId: user.id,
                    parentId: parent.id,
                },
            });
            const result = await scrapsService.getScraps();
            expect(result.type).toBe('Success');
            if (result.type === 'Success') {
                // デフォルトでは onlyRootScraps: true なので、子要素は含まれないはず
                // Root Scrap + Parent Scrap = 2件
                expect(result.value).toHaveLength(2);
                const titles = result.value.map((s) => s.title);
                expect(titles).toContain('Root Scrap');
                expect(titles).toContain('Parent');
                expect(titles).not.toContain('Child Scrap');
            }
        });
        // 指定したタグが付いたスクラップのみ抽出できるか検証
        it('SCRAPS_SERVICE_002: タグIDを指定して関連するスクラップのみが取得できること', async () => {
            const user = await createTestUser();
            const tag = await prisma.tags.create({ data: { name: 'TargetTag' } });
            const otherTag = await prisma.tags.create({ data: { name: 'OtherTag' } });
            // ターゲットタグを持つスクラップ
            await prisma.scraps.create({
                data: {
                    title: 'Target Scrap',
                    body: 'Body',
                    userId: user.id,
                    tagScraps: { create: { tagId: tag.id } },
                },
            });
            // 別のタグを持つスクラップ
            await prisma.scraps.create({
                data: {
                    title: 'Other Scrap',
                    body: 'Body',
                    userId: user.id,
                    tagScraps: { create: { tagId: otherTag.id } },
                },
            });
            const result = await scrapsService.getScraps({
                tagIds: [tag.id],
                onlyRootScraps: false,
                includeUserInfo: false,
            });
            expect(result.type).toBe('Success');
            if (result.type === 'Success') {
                expect(result.value).toHaveLength(1);
                expect(result.value[0].title).toBe('Target Scrap');
            }
        });
        // フォロー中のユーザーのスクラップのみ抽出できるか検証
        it('SCRAPS_SERVICE_003: フォローしているユーザーのIDでフィルタリングして取得できること', async () => {
            const me = await createTestUser();
            const followee = await createTestUser();
            const stranger = await createTestUser();
            // フォロー関係を作成
            await prisma.userRelationships.create({
                data: { followerId: me.id, followeeId: followee.id },
            });
            // フォローしているユーザーのスクラップ
            await prisma.scraps.create({
                data: {
                    title: 'Followee Scrap',
                    body: '.',
                    userId: followee.id,
                },
            });
            // フォローしていないユーザーのスクラップ
            await prisma.scraps.create({
                data: {
                    title: 'Stranger Scrap',
                    body: '.',
                    userId: stranger.id,
                },
            });
            const result = await scrapsService.getScraps(undefined, {
                userId: me.id,
            });
            expect(result.type).toBe('Success');
            if (result.type === 'Success') {
                expect(result.value).toHaveLength(1);
                expect(result.value[0].userId).toBe(followee.id);
            }
        });
    });
    describe('getScrapById', () => {
        // ID指定でスクラップ詳細が取得できるか検証
        it('SCRAPS_SERVICE_004: 存在するIDを指定してスクラップの詳細が取得できること', async () => {
            const user = await createTestUser();
            const scrap = await prisma.scraps.create({
                data: {
                    title: 'Detail Scrap',
                    body: 'Body',
                    userId: user.id,
                },
            });
            const result = await scrapsService.getScrapById(scrap.id);
            expect(result.type).toBe('Success');
            if (result.type === 'Success') {
                expect(result.value.id).toBe(scrap.id);
            }
        });
        // 存在しないIDを指定した際のエラーハンドリングを検証
        it('SCRAPS_SERVICE_005: 存在しないIDを指定した場合にScrapNotFoundErrorが返ること', async () => {
            const result = await scrapsService.getScrapById('non-existent-id');
            expect(result.type).toBe('Failure');
            if (result.type === 'Failure') {
                expect(result.error).toBeInstanceOf(ScrapNotFoundError);
            }
        });
    });
    describe('addScrap', () => {
        // 必須項目のみでスクラップ作成が成功するか検証
        it('SCRAPS_SERVICE_006: 必須項目のみでスクラップが新規作成されること', async () => {
            const user = await createTestUser();
            const input = {
                title: 'New Scrap',
                body: 'New Body',
                userId: user.id,
                parentId: null,
            };
            const result = await scrapsService.addScrap(input);
            expect(result.type).toBe('Success');
            if (result.type === 'Success') {
                expect(result.value.title).toBe(input.title);
                expect(result.value.id).toBeDefined();
            }
        });
        // スクラップ作成時にタグ紐付けが正しく行われるか検証
        it('SCRAPS_SERVICE_007: タグを指定してスクラップが作成されタグ紐付けが行われること', async () => {
            const user = await createTestUser();
            const tag = await prisma.tags.create({ data: { name: 'Tag1' } });
            const input = {
                title: 'Tagged Scrap',
                body: 'Body',
                userId: user.id,
                parentId: null,
            };
            const result = await scrapsService.addScrap(input, [tag.id]);
            expect(result.type).toBe('Success');
            if (result.type === 'Success') {
                // 複合キー対応: findFirst を使用
                const relation = await prisma.tagScraps.findFirst({
                    where: {
                        scrapId: result.value.id,
                        tagId: tag.id,
                    },
                });
                expect(relation).not.toBeNull();
            }
        });
        // 存在しないタグを指定した際のエラーハンドリングを検証
        it('SCRAPS_SERVICE_008: 存在しないタグIDを指定した場合にTagNotFoundErrorが返ること', async () => {
            const user = await createTestUser();
            const input = {
                title: 'Fail Scrap',
                body: 'Body',
                userId: user.id,
                parentId: null,
            };
            const result = await scrapsService.addScrap(input, [
                'non-existent-tag-id',
            ]);
            expect(result.type).toBe('Failure');
            if (result.type === 'Failure') {
                expect(result.error).toBeInstanceOf(TagNotFoundError);
            }
        });
    });
    describe('updateScrap', () => {
        // 自身のスクラップ内容を更新できるか検証
        it('SCRAPS_SERVICE_009: 自身のスクラップの内容を更新できること', async () => {
            const user = await createTestUser();
            const scrap = await prisma.scraps.create({
                data: {
                    title: 'Old Title',
                    body: 'Old Body',
                    userId: user.id,
                },
            });
            const updateContent = {
                title: 'New Title',
            };
            const result = await scrapsService.updateScrap(scrap.id, user.id, updateContent);
            expect(result.type).toBe('Success');
            const updated = await prisma.scraps.findUnique({
                where: { id: scrap.id },
            });
            expect(updated?.title).toBe('New Title');
        });
        // スクラップのタグ情報の更新（付け替え）ができるか検証
        it('SCRAPS_SERVICE_010: 自身のスクラップのタグ情報を更新できること', async () => {
            const user = await createTestUser();
            const tag1 = await prisma.tags.create({ data: { name: 'Tag1' } });
            const tag2 = await prisma.tags.create({ data: { name: 'Tag2' } });
            const scrap = await prisma.scraps.create({
                data: {
                    title: 'Scrap',
                    body: 'Body',
                    userId: user.id,
                    tagScraps: { create: { tagId: tag1.id } },
                },
            });
            // タグを Tag1 から Tag2 へ変更
            const result = await scrapsService.updateScrap(scrap.id, user.id, undefined, // contentは変更なし
            [tag2.id]);
            expect(result.type).toBe('Success');
            // Tag1 が消えているか確認
            const oldRel = await prisma.tagScraps.findFirst({
                where: { scrapId: scrap.id, tagId: tag1.id },
            });
            expect(oldRel).toBeNull();
            // Tag2 が付いているか確認
            const newRel = await prisma.tagScraps.findFirst({
                where: { scrapId: scrap.id, tagId: tag2.id },
            });
            expect(newRel).not.toBeNull();
        });
        // 他人のスクラップを更新できないよう保護されているか検証
        it('SCRAPS_SERVICE_011: 他人のスクラップを更新しようとした場合にNotScrapOwnerErrorが返ること', async () => {
            const owner = await createTestUser();
            const otherUser = await createTestUser();
            const scrap = await prisma.scraps.create({
                data: {
                    title: 'Owner Scrap',
                    body: 'Body',
                    userId: owner.id,
                },
            });
            const result = await scrapsService.updateScrap(scrap.id, otherUser.id, {
                title: 'Hacked',
            });
            expect(result.type).toBe('Failure');
            if (result.type === 'Failure') {
                expect(result.error).toBeInstanceOf(NotScrapOwnerError);
            }
        });
    });
    describe('deleteScrap', () => {
        // 自身のスクラップを削除できるか検証
        it('SCRAPS_SERVICE_012: 自身のスクラップを削除できること', async () => {
            const user = await createTestUser();
            const scrap = await prisma.scraps.create({
                data: {
                    title: 'To Delete',
                    body: 'Body',
                    userId: user.id,
                },
            });
            const result = await scrapsService.deleteScrap(scrap.id, user.id);
            expect(result.type).toBe('Success');
            const deleted = await prisma.scraps.findUnique({
                where: { id: scrap.id },
            });
            expect(deleted).toBeNull();
        });
        // 他人のスクラップを削除できないよう保護されているか検証
        it('SCRAPS_SERVICE_013: 他人のスクラップを削除しようとした場合にNotScrapOwnerErrorが返ること', async () => {
            const owner = await createTestUser();
            const otherUser = await createTestUser();
            const scrap = await prisma.scraps.create({
                data: {
                    title: 'Owner Scrap',
                    body: 'Body',
                    userId: owner.id,
                },
            });
            const result = await scrapsService.deleteScrap(scrap.id, otherUser.id);
            expect(result.type).toBe('Failure');
            if (result.type === 'Failure') {
                expect(result.error).toBeInstanceOf(NotScrapOwnerError);
            }
        });
    });
});
