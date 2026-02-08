import { prisma } from '../../lib/prisma.js';
import { createTestUser } from '../../testing/factories.js';
import { searchRepository } from './repository.js';
describe('SearchRepository', () => {
    const repo = searchRepository;
    // --- findArtifactsByKeyword ---
    describe('findArtifactsByKeyword', () => {
        it('SEARCH_REPO_001: キーワードがタイトルに含まれるアーティファクトを取得できること', async () => {
            const user = await createTestUser();
            const art1 = await prisma.artifacts.create({
                data: {
                    title: 'TypeScript Tutorial',
                    body: 'Content',
                    userId: user.id,
                    publishedAt: new Date(),
                },
            });
            await prisma.artifacts.create({
                data: {
                    title: 'Rust Guide',
                    body: 'Content',
                    userId: user.id,
                    publishedAt: new Date(),
                },
            });
            const results = await repo.findArtifactsByKeyword('TypeScript');
            expect(results).toHaveLength(1);
            expect(results[0].id).toBe(art1.id);
        });
        it('SEARCH_REPO_002: キーワードが本文に含まれるアーティファクトを取得できること', async () => {
            const user = await createTestUser();
            const art1 = await prisma.artifacts.create({
                data: {
                    title: 'No Match',
                    body: 'This is about Python programming',
                    userId: user.id,
                    publishedAt: new Date(),
                },
            });
            await prisma.artifacts.create({
                data: {
                    title: 'No Match',
                    body: 'Just text',
                    userId: user.id,
                    publishedAt: new Date(),
                },
            });
            const results = await repo.findArtifactsByKeyword('Python');
            expect(results).toHaveLength(1);
            expect(results[0].id).toBe(art1.id);
        });
        it('SEARCH_REPO_003: 一致するキーワードがない場合にアーティファクトで空配列を返すこと', async () => {
            const user = await createTestUser();
            await prisma.artifacts.create({
                data: { title: 'Title', body: 'Body', userId: user.id },
            });
            const results = await repo.findArtifactsByKeyword('NonExistent');
            expect(results).toEqual([]);
        });
    });
    // --- findUsersByKeyword ---
    describe('findUsersByKeyword', () => {
        it('SEARCH_REPO_004: キーワードがユーザー名に含まれるユーザーを取得できること', async () => {
            const u1 = await createTestUser({ name: 'Alice Wonderland' });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const u2 = await createTestUser({ name: 'Bob Builder' });
            const results = await repo.findUsersByKeyword('Alice');
            expect(results).toHaveLength(1);
            expect(results[0].id).toBe(u1.id);
        });
        it('SEARCH_REPO_005: 一致するキーワードがない場合にユーザーで空配列を返すこと', async () => {
            await createTestUser({ name: 'User A' });
            const results = await repo.findUsersByKeyword('Xenon');
            expect(results).toEqual([]);
        });
    });
    // --- findScrapsByKeyword ---
    describe('findScrapsByKeyword', () => {
        it('SEARCH_REPO_006: キーワードがタイトルに含まれるスクラップを取得できること', async () => {
            const user = await createTestUser();
            const s1 = await prisma.scraps.create({
                data: { title: 'React Hooks', body: 'memo', userId: user.id },
            });
            await prisma.scraps.create({
                data: { title: 'Vue Composition', body: 'memo', userId: user.id },
            });
            const results = await repo.findScrapsByKeyword('Hooks');
            expect(results).toHaveLength(1);
            expect(results[0].id).toBe(s1.id);
        });
        it('SEARCH_REPO_007: キーワードが本文に含まれるスクラップを取得できること', async () => {
            const user = await createTestUser();
            const s1 = await prisma.scraps.create({
                data: {
                    title: 'Memo',
                    body: 'Check out Next.js features',
                    userId: user.id,
                },
            });
            const results = await repo.findScrapsByKeyword('Next.js');
            expect(results).toHaveLength(1);
            expect(results[0].id).toBe(s1.id);
        });
        it('SEARCH_REPO_008: 一致するキーワードがない場合にスクラップで空配列を返すこと', async () => {
            const user = await createTestUser();
            await prisma.scraps.create({
                data: { title: 'T', body: 'B', userId: user.id },
            });
            const results = await repo.findScrapsByKeyword('Nothing');
            expect(results).toEqual([]);
        });
    });
    // --- findTagsByKeyword ---
    describe('findTagsByKeyword', () => {
        it('SEARCH_REPO_009: キーワードがタグ名に含まれるタグを取得できること', async () => {
            const t1 = await prisma.tags.create({ data: { name: 'JavaScript' } });
            await prisma.tags.create({ data: { name: 'Java' } }); // "Java"も"Script"を含まない
            const results = await repo.findTagsByKeyword('Script');
            expect(results).toHaveLength(1);
            expect(results[0].id).toBe(t1.id);
        });
        it('SEARCH_REPO_010: 一致するキーワードがない場合にタグで空配列を返すこと', async () => {
            await prisma.tags.create({ data: { name: 'HTML' } });
            const results = await repo.findTagsByKeyword('CSS');
            expect(results).toEqual([]);
        });
    });
});
