import { faker } from '@faker-js/faker';
import { PrismaClient } from '../../generated/prisma/index.js';
const prisma = new PrismaClient();
async function main() {
    // 1. クリーンアップ（削除の順番に注意：子から親へ）
    await prisma.userRelationships.deleteMany();
    await prisma.comments.deleteMany();
    await prisma.tagScraps.deleteMany();
    await prisma.scraps.deleteMany();
    await prisma.assets.deleteMany();
    await prisma.tagArtifacts.deleteMany();
    await prisma.artifacts.deleteMany();
    await prisma.tags.deleteMany();
    await prisma.users.deleteMany();
    // 2. Tags の作成（あらかじめ共通のタグを作っておく）
    const tagNames = ['React', 'Rust', 'TypeScript', 'Prisma', 'Hono', 'Next.js'];
    const tags = await Promise.all(tagNames.map((name) => prisma.tags.create({ data: { name } })));
    // 3. Users の作成 (10人)
    const users = [];
    for (let i = 0; i < 10; i++) {
        const user = await prisma.users.create({
            data: {
                email: faker.internet.email(),
                userName: faker.person.fullName(),
            },
        });
        users.push(user);
    }
    // 4. UserRelationships (フォロー関係の作成)
    for (const user of users) {
        // 自分以外のユーザーからランダムに2〜3人選んでフォローする
        const others = users.filter((u) => u.id !== user.id);
        const followTargets = others.sort(() => 0.5 - Math.random()).slice(0, 2);
        for (const target of followTargets) {
            await prisma.userRelationships.create({
                data: {
                    followerId: user.id,
                    followeeId: target.id,
                },
            });
        }
    }
    // 5. Artifacts
    for (const user of users) {
        // ランダムに2つの異なるタグを選択
        const selectedTags = [...tags].sort(() => 0.5 - Math.random()).slice(0, 2);
        await prisma.artifacts.create({
            data: {
                title: faker.commerce.productName(),
                body: faker.lorem.paragraphs(),
                userId: user.id,
                publishedAt: new Date(),
                tagArtifacts: {
                    create: selectedTags.map((tag) => ({
                        tag: {
                            connect: { id: tag.id },
                        },
                    })),
                },
            },
        });
    }
    // 6. Scraps (再帰構造 + Tag紐付け)
    for (const user of users) {
        const parentTitle = faker.lorem.words(3);
        const selectedTags = [...tags].sort(() => 0.5 - Math.random()).slice(0, 2);
        // 親スクラップの作成
        const parentScrap = await prisma.scraps.create({
            data: {
                title: parentTitle,
                body: `Parent Scrap by ${user.userName}: ${faker.lorem.sentence()}`,
                userId: user.id,
                tagScraps: {
                    create: selectedTags.map((tag) => ({
                        tag: {
                            connect: { id: tag.id },
                        },
                    })),
                },
            },
        });
        // 子スクラップ（返信）の作成
        await prisma.scraps.create({
            data: {
                title: `Re: ${parentTitle}`,
                body: `Reply from ${faker.person.firstName()}: ${faker.lorem.sentence()}`,
                userId: users[Math.floor(Math.random() * users.length)].id,
                parentId: parentScrap.id,
                tagScraps: {
                    create: selectedTags.map((tag) => ({
                        tag: {
                            connect: { id: tag.id },
                        },
                    })),
                },
            },
        });
    }
    // 7. Comments (再帰構造: Artifactに対するコメント -> 返信)
    const allArtifacts = await prisma.artifacts.findMany();
    for (const artifact of allArtifacts) {
        // 最初のコメント
        const rootComment = await prisma.comments.create({
            data: {
                body: faker.lorem.sentence(),
                userId: users[Math.floor(Math.random() * users.length)].id,
                artifactId: artifact.id,
            },
        });
        // コメントへの返信（1階層）
        await prisma.comments.create({
            data: {
                body: `Replying to comment: ${faker.lorem.sentence()}`,
                userId: users[Math.floor(Math.random() * users.length)].id,
                artifactId: artifact.id,
                parentId: rootComment.id, // 自己参照ID
            },
        });
    }
    console.log('Seed data created successfully!');
}
main()
    .catch((e) => {
    // e が Error オブジェクトかどうかをチェックして、適切に表示
    if (e instanceof Error) {
        console.error(e.message);
    }
    else {
        console.error('An unexpected error occurred:', e);
    }
    throw e;
})
    .finally(async () => {
    // 成功・失敗に関わらず接続を切断
    await prisma.$disconnect();
});
