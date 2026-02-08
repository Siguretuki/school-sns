import { prisma } from '../../lib/prisma.js';
import { createTestUser } from '../../testing/factories.js';
import { cleanupDatabase } from '../../testing/setup.js';
import { NotOwnerError } from './error.js';
import { mediaService } from './index.js';
describe('MediaService', () => {
    // テスト実行ごとにデータベースをクリーンアップ
    beforeEach(async () => {
        await cleanupDatabase();
    });
    describe('upload', () => {
        // 正しいファイル入力でアップロードと登録が成功するか検証
        it('MEDIA_SERVICE_001: 正しいファイル入力でメディアがアップロードされ登録情報が返ること', async () => {
            const user = await createTestUser();
            // Node.js環境でのテスト用にFileオブジェクトを模倣
            const mockFile = {
                name: 'test-image.png',
                type: 'image/png',
                size: 12345,
            };
            const result = await mediaService.upload(user.id, mockFile);
            expect(result.type).toBe('Success');
            if (result.type === 'Success') {
                expect(result.value.userId).toBe(user.id);
                expect(result.value.originalName).toBe('test-image.png');
                expect(result.value.url).toContain('test-image.png');
                // BigIntの比較は文字列またはBigIntリテラルで行う
                expect(result.value.sizeBytes).toBe(BigInt(12345));
            }
        });
    });
    describe('getUserMedia', () => {
        // 指定したユーザーのメディア一覧が取得できるか検証
        it('MEDIA_SERVICE_002: 指定したユーザーのメディア一覧が取得できること', async () => {
            const user = await createTestUser();
            // DBに直接データを投入
            await prisma.assets.create({
                data: {
                    userId: user.id,
                    url: 'https://example.com/1.png',
                    fileType: 'image/png',
                    originalName: '1.png',
                    sizeBytes: 1000,
                },
            });
            const result = await mediaService.getUserMedia(user.id);
            expect(result.type).toBe('Success');
            if (result.type === 'Success') {
                expect(result.value).toHaveLength(1);
                expect(result.value[0].originalName).toBe('1.png');
            }
        });
        // 取得数制限(limit)などのオプションが機能するか検証
        it('MEDIA_SERVICE_003: オプション（取得数制限など）を指定してメディア一覧が取得できること', async () => {
            const user = await createTestUser();
            // 3件データを作成
            for (let i = 1; i <= 3; i++) {
                await prisma.assets.create({
                    data: {
                        userId: user.id,
                        url: `https://example.com/${i.toString()}.png`,
                        fileType: 'image/png',
                        originalName: `${i.toString()}.png`,
                        sizeBytes: 1000,
                    },
                });
            }
            // limit: 2 で取得
            const result = await mediaService.getUserMedia(user.id, { limit: 2 });
            expect(result.type).toBe('Success');
            if (result.type === 'Success') {
                expect(result.value).toHaveLength(2);
            }
        });
    });
    describe('deleteMedia', () => {
        // 自身のメディアを正常に削除できるか検証
        it('MEDIA_SERVICE_004: 自身のメディアを削除できること', async () => {
            const user = await createTestUser();
            const media = await prisma.assets.create({
                data: {
                    userId: user.id,
                    url: 'https://example.com/del.png',
                    fileType: 'image/png',
                    originalName: 'del.png',
                    sizeBytes: 1000,
                },
            });
            const result = await mediaService.deleteMedia(media.id, user.id);
            expect(result.type).toBe('Success');
            // DBから消えているか確認
            const deleted = await prisma.assets.findUnique({
                where: { id: media.id },
            });
            expect(deleted).toBeNull();
        });
        // 他人のメディアを削除できないよう保護されているか検証
        it('MEDIA_SERVICE_005: 他人のメディアを削除しようとした場合にNotOwnerErrorが返ること', async () => {
            const owner = await createTestUser();
            const otherUser = await createTestUser();
            const media = await prisma.assets.create({
                data: {
                    userId: owner.id,
                    url: 'https://example.com/owner.png',
                    fileType: 'image/png',
                    originalName: 'owner.png',
                    sizeBytes: 1000,
                },
            });
            const result = await mediaService.deleteMedia(media.id, otherUser.id);
            expect(result.type).toBe('Failure');
            if (result.type === 'Failure') {
                expect(result.error).toBeInstanceOf(NotOwnerError);
            }
        });
    });
});
