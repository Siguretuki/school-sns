import { describe, it, expect } from 'vitest';
import { prisma } from '../../lib/prisma.js';
import { createTestUser } from '../../testing/factories.js';
import { tagsRepository } from './repository.js';
describe('TagsRepository', () => {
    const repo = tagsRepository;
    // ユニークなタグ名を生成するヘルパー関数
    const generateTagName = (prefix) => `${prefix}_${Date.now().toString()}_${Math.random().toString(36).slice(2, 7)}`;
    // --- getTags ---
    describe('getTags', () => {
        it('TAG_REPO_001: 条件なしですべてのタグを取得できること', async () => {
            // ランダムな名前を使うことで、前回のテストの残骸と衝突するのを防ぐ
            await repo.addTag({
                name: generateTagName('Tag_All_1'),
                slug: null,
            });
            await repo.addTag({
                name: generateTagName('Tag_All_2'),
                slug: null,
            });
            const results = await repo.getTags();
            // getTagsは全件取得なので、自分が作った2件以上あることを確認
            expect(results.length).toBeGreaterThanOrEqual(2);
        });
        it('TAG_REPO_002: 指定したArtifact IDに関連付けられたタグのみを取得できること', async () => {
            const user = await createTestUser();
            const tag1 = await repo.addTag({
                name: generateTagName('A-Tag'),
                slug: null,
            });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const tag2 = await repo.addTag({
                name: generateTagName('Other-Tag'),
                slug: null,
            });
            const art = await prisma.artifacts.create({
                data: { title: 'Art', body: 'Body', userId: user.id },
            });
            await prisma.tagArtifacts.create({
                data: { artifactId: art.id, tagId: tag1.id },
            });
            const results = await repo.getTags({ artifactId: art.id });
            expect(results).toHaveLength(1);
            expect(results[0].id).toBe(tag1.id);
        });
        it('TAG_REPO_003: 指定したScrap IDに関連付けられたタグのみを取得できること', async () => {
            const user = await createTestUser();
            const tag1 = await repo.addTag({
                name: generateTagName('S-Tag'),
                slug: null,
            });
            const scrap = await prisma.scraps.create({
                data: { title: 'Scrap', body: 'Body Content', userId: user.id },
            });
            await prisma.tagScraps.create({
                data: { scrapId: scrap.id, tagId: tag1.id },
            });
            const results = await repo.getTags({ scrapId: scrap.id });
            expect(results).toHaveLength(1);
            expect(results[0].id).toBe(tag1.id);
        });
    });
    // --- getTagById ---
    describe('getTagById', () => {
        it('TAG_REPO_004: 指定したIDに一致するタグを1件取得できること', async () => {
            const created = await repo.addTag({
                name: generateTagName('Target'),
                slug: null,
            });
            const found = await repo.getTagById(created.id);
            expect(found?.id).toBe(created.id);
        });
        it('TAG_REPO_005: 存在しないIDを指定した際にnullを返すこと', async () => {
            const found = await repo.getTagById('non-existent');
            expect(found).toBeNull();
        });
    });
    // --- addTag ---
    describe('addTag', () => {
        it('TAG_REPO_006: 正しい入力値で新しいタグが作成されること', async () => {
            const name = generateTagName('New Tag');
            const result = await repo.addTag({
                name,
                slug: null,
            });
            expect(result.id).toBeDefined();
            expect(result.name).toBe(name);
        });
    });
    // --- isExistsTagName ---
    describe('isExistsTagName', () => {
        it('TAG_REPO_007: 指定した名前（部分一致）を持つタグが存在する場合にそのタグ情報を返すこと', async () => {
            const uniqueName = generateTagName('Python');
            await repo.addTag({
                name: uniqueName,
                slug: null,
            });
            // 名前の一部（Python -> Py）で検索
            const found = await repo.isExistsTagName('Python');
            expect(found).not.toBeNull();
            expect(found?.name).toBe(uniqueName);
        });
        it('TAG_REPO_008: 指定した名前を持つタグが存在しない場合にnullを返すこと', async () => {
            await repo.addTag({
                name: generateTagName('Rust'),
                slug: null,
            });
            const found = await repo.isExistsTagName('Java_NonExistent');
            expect(found).toBeNull();
        });
    });
    // --- updateTag ---
    describe('updateTag', () => {
        it('TAG_REPO_009: 指定したIDのタグ名を更新できること', async () => {
            const tag = await repo.addTag({
                name: generateTagName('OldName'),
                slug: null,
            });
            const newName = generateTagName('NewName');
            const updated = await repo.updateTag(tag.id, { name: newName });
            expect(updated.name).toBe(newName);
        });
    });
    // --- isExistsTag ---
    describe('isExistsTag', () => {
        it('TAG_REPO_010: 指定したIDのタグが存在する場合にtrueを返すこと', async () => {
            const tag = await repo.addTag({
                name: generateTagName('Exist'),
                slug: null,
            });
            expect(await repo.isExistsTag(tag.id)).toBe(true);
        });
        it('TAG_REPO_011: 指定したIDのタグが存在しない場合にfalseを返すこと', async () => {
            expect(await repo.isExistsTag('non-existent')).toBe(false);
        });
    });
    // --- isExistsTags ---
    describe('isExistsTags', () => {
        it('TAG_REPO_012: 指定した複数のタグIDがすべて存在する場合にtrueを返すこと', async () => {
            const t1 = await repo.addTag({
                name: generateTagName('T1_Exist'),
                slug: null,
            });
            const t2 = await repo.addTag({
                name: generateTagName('T2_Exist'),
                slug: null,
            });
            expect(await repo.isExistsTags([t1.id, t2.id])).toBe(true);
        });
        it('TAG_REPO_013: 指定した複数のタグIDのうち一部でも欠けている場合にfalseを返すこと', async () => {
            const t1 = await repo.addTag({
                name: generateTagName('T1_Partial'),
                slug: null,
            });
            expect(await repo.isExistsTags([t1.id, 'fake-id'])).toBe(false);
        });
    });
    // --- checkAttachedOthersArtifact ---
    describe('checkAttachedOthersArtifact', () => {
        it('TAG_REPO_014: タグが他ユーザーのArtifactで使用されている場合にtrueを返すこと', async () => {
            const me = await createTestUser();
            const other = await createTestUser();
            const tag = await repo.addTag({
                name: generateTagName('Shared'),
                slug: null,
            });
            const otherArt = await prisma.artifacts.create({
                data: { title: 'Other Art', body: '.', userId: other.id },
            });
            await prisma.tagArtifacts.create({
                data: { artifactId: otherArt.id, tagId: tag.id },
            });
            const result = await repo.checkAttachedOthersArtifact(tag.id, me.id);
            expect(result).toBe(true);
        });
        it('TAG_REPO_015: タグが自分自身のArtifactのみで使用されている（または未使用）場合にfalseを返すこと', async () => {
            const me = await createTestUser();
            const tag = await repo.addTag({
                name: generateTagName('Mine'),
                slug: null,
            });
            const myArt = await prisma.artifacts.create({
                data: { title: 'My Art', body: '.', userId: me.id },
            });
            await prisma.tagArtifacts.create({
                data: { artifactId: myArt.id, tagId: tag.id },
            });
            const result = await repo.checkAttachedOthersArtifact(tag.id, me.id);
            expect(result).toBe(false);
        });
    });
    // --- checkAttachedOthersScrap ---
    describe('checkAttachedOthersScrap', () => {
        it('TAG_REPO_016: タグが他ユーザーのScrapで使用されている場合にtrueを返すこと', async () => {
            const me = await createTestUser();
            const other = await createTestUser();
            const tag = await repo.addTag({
                name: generateTagName('SharedScrap'),
                slug: null,
            });
            const otherScrap = await prisma.scraps.create({
                data: { title: 'Other Scrap', body: '.', userId: other.id },
            });
            await prisma.tagScraps.create({
                data: { scrapId: otherScrap.id, tagId: tag.id },
            });
            const result = await repo.checkAttachedOthersScrap(tag.id, me.id);
            expect(result).toBe(true);
        });
        it('TAG_REPO_017: タグが自分自身のScrapのみで使用されている（または未使用）場合にfalseを返すこと', async () => {
            const me = await createTestUser();
            const tag = await repo.addTag({
                name: generateTagName('MyScrapTag'),
                slug: null,
            });
            const myScrap = await prisma.scraps.create({
                data: { title: 'My Scrap', body: '.', userId: me.id },
            });
            await prisma.tagScraps.create({
                data: { scrapId: myScrap.id, tagId: tag.id },
            });
            const result = await repo.checkAttachedOthersScrap(tag.id, me.id);
            expect(result).toBe(false);
        });
    });
    // --- deleteTag ---
    describe('deleteTag', () => {
        it('TAG_REPO_018: 指定したIDのタグを削除できること', async () => {
            const tag = await repo.addTag({
                name: generateTagName('DeleteMe'),
                slug: null,
            });
            await repo.deleteTag(tag.id);
            const found = await repo.getTagById(tag.id);
            expect(found).toBeNull();
        });
    });
});
