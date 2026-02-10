import { prisma } from '../../lib/prisma.js'
import { createTestUser } from '../../testing/factories.js'
import { cleanupDatabase } from '../../testing/setup.js'
import { scrapsRepository } from './repository.js'

describe('ScrapsRepository', () => {
  const repo = scrapsRepository

  beforeEach(async () => {
    await cleanupDatabase() // これだけで全リセット完了
  })

  // --- getFollowingUserIds ---
  describe('getFollowingUserIds', () => {
    it('SCRAP_REPO_001: 指定したユーザーがフォローしている全ユーザーのIDを取得できること', async () => {
      const me = await createTestUser()
      const target1 = await createTestUser()
      const target2 = await createTestUser()
      await prisma.userRelationships.createMany({
        data: [
          { followerId: me.id, followeeId: target1.id },
          { followerId: me.id, followeeId: target2.id },
        ],
      })
      const results = await repo.getFollowingUserIds(me.id)
      expect(results).toHaveLength(2)
      expect(results.map((r) => r.followeeId)).toEqual(
        expect.arrayContaining([target1.id, target2.id]),
      )
    })

    it('SCRAP_REPO_002: フォローしているユーザーがいない場合に空配列を返すこと', async () => {
      const me = await createTestUser()
      const results = await repo.getFollowingUserIds(me.id)
      expect(results).toEqual([])
    })
  })

  // --- getScraps ---
  describe('getScraps', () => {
    it('SCRAP_REPO_003: 条件なしですべてのスクラップを取得できること', async () => {
      const user = await createTestUser()
      await repo.addScrap({
        body: 'B1',
        userId: user.id,
        parentId: null,
      })
      await repo.addScrap({
        body: 'B2',
        userId: user.id,
        parentId: null,
      })
      const results = await repo.getScraps()
      expect(results).toHaveLength(2)
    })

    it('SCRAP_REPO_004: limitとpageによるページネーションが正しく機能すること', async () => {
      const user = await createTestUser()
      for (let i = 1; i <= 3; i++) {
        await repo.addScrap({
          body: '...',
          userId: user.id,
          parentId: null,
        })
      }

      const page1 = await repo.getScraps({
        page: 1,
        limit: 1,
        onlyRootScraps: false,
      })
      const page2 = await repo.getScraps({
        page: 2,
        limit: 1,
        onlyRootScraps: false,
      })
      expect(page1).toHaveLength(1)
      expect(page2).toHaveLength(1)
      expect(page1[0].id).not.toBe(page2[0].id)
    })

    it('SCRAP_REPO_005: 指定した複数のIDに一致するスクラップのみを取得できること', async () => {
      const user = await createTestUser()
      const s1 = await repo.addScrap({
        body: 'B1',
        userId: user.id,
        parentId: null,
      })
      const s2 = await repo.addScrap({
        body: 'B2',
        userId: user.id,
        parentId: null,
      })
      await repo.addScrap({
        body: 'B3',
        userId: user.id,
        parentId: null,
      })

      const results = await repo.getScraps({
        ids: [s1.id, s2.id],
        onlyRootScraps: false,
      })
      expect(results).toHaveLength(2)
      expect(results.map((r) => r.id)).toContain(s1.id)
      expect(results.map((r) => r.id)).toContain(s2.id)
    })
  })

  // --- getScrapById ---
  describe('getScrapById', () => {
    it('SCRAP_REPO_006: 指定したIDに一致するスクラップを1件取得できること', async () => {
      const user = await createTestUser()
      const created = await repo.addScrap({
        body: 'B',
        userId: user.id,
        parentId: null,
      })
      const found = await repo.getScrapById(created.id)
      expect(found?.id).toBe(created.id)
    })

    it('SCRAP_REPO_007: 存在しないIDを指定した際にnullを返すこと', async () => {
      const found = await repo.getScrapById('non-existent-uuid')
      expect(found).toBeNull()
    })
  })

  // --- addScrap ---
  describe('addScrap', () => {
    it('SCRAP_REPO_008: 正しい入力値で新しいスクラップが作成されること', async () => {
      const user = await createTestUser()
      const data = {
        body: 'Content',
        userId: user.id,
        parentId: null,
      }
      const created = await repo.addScrap(data)
      expect(created.body).toBe('Content')
    })
  })

  // --- updateScrap ---
  describe('updateScrap', () => {
    it('SCRAP_REPO_009: 指定したIDのスクラップの内容を更新できること', async () => {
      const user = await createTestUser()
      const s = await repo.addScrap({
        body: 'Old',
        userId: user.id,
        parentId: null,
      })
      const updated = await repo.updateScrap(s.id, { body: 'Updated' })
      expect(updated.body).toBe('Updated')
    })
  })

  // --- isOwnScrap ---
  describe('isOwnScrap', () => {
    it('SCRAP_REPO_010: スクラップの所有者が一致する場合にtrueを返すこと', async () => {
      const user = await createTestUser()
      const s = await repo.addScrap({
        body: 'B',
        userId: user.id,
        parentId: null,
      })
      expect(await repo.isOwnScrap(s.id, user.id)).toBe(true)
    })

    it('SCRAP_REPO_011: 所有者が異なる場合にfalseを返すこと', async () => {
      const owner = await createTestUser()
      const other = await createTestUser()
      const s = await repo.addScrap({
        body: 'B',
        userId: owner.id,
        parentId: null,
      })
      expect(await repo.isOwnScrap(s.id, other.id)).toBe(false)
    })
  })

  // --- registerTags ---
  describe('registerTags', () => {
    it('SCRAP_REPO_012: スクラップに複数のタグを新規登録できること', async () => {
      const user = await createTestUser()
      const s = await repo.addScrap({
        body: 'B',
        userId: user.id,
        parentId: null,
      })
      const t1 = await prisma.tags.create({ data: { name: 'Tag1' } })
      const t2 = await prisma.tags.create({ data: { name: 'Tag2' } })

      await repo.registerTags(s.id, [t1.id, t2.id])
      const count = await prisma.tagScraps.count({ where: { scrapId: s.id } })
      expect(count).toBe(2)
    })
  })

  // --- updateTags ---
  describe('updateTags', () => {
    it('SCRAP_REPO_013: 既存のタグを新しいタグリストで同期（追加・削除）できること', async () => {
      const user = await createTestUser()
      const s = await repo.addScrap({
        body: 'B',
        userId: user.id,
        parentId: null,
      })
      const tA = await prisma.tags.create({ data: { name: 'A' } })
      const tB = await prisma.tags.create({ data: { name: 'B' } })
      const tC = await prisma.tags.create({ data: { name: 'C' } })

      await repo.registerTags(s.id, [tA.id, tB.id])
      await repo.updateTags(s.id, [tB.id, tC.id]) // A削除, C追加

      const current = await prisma.tagScraps.findMany({
        where: { scrapId: s.id },
      })
      const ids = current.map((c) => c.tagId)
      expect(ids).toContain(tB.id)
      expect(ids).toContain(tC.id)
      expect(ids).not.toContain(tA.id)
    })

    it('SCRAP_REPO_014: タグリストを空にして更新した際に関連する全タグが削除されること', async () => {
      const user = await createTestUser()
      const s = await repo.addScrap({
        body: 'B',
        userId: user.id,
        parentId: null,
      })
      const t1 = await prisma.tags.create({ data: { name: 'T1' } })
      await repo.registerTags(s.id, [t1.id])

      await repo.updateTags(s.id, [])
      const count = await prisma.tagScraps.count({ where: { scrapId: s.id } })
      expect(count).toBe(0)
    })
  })

  // --- deleteScrap ---
  describe('deleteScrap', () => {
    it('SCRAP_REPO_015: スクラップが削除され関連するタグ情報も削除されること', async () => {
      const user = await createTestUser()
      const s = await repo.addScrap({
        body: 'B',
        userId: user.id,
        parentId: null,
      })
      const t = await prisma.tags.create({ data: { name: 'T' } })
      await repo.registerTags(s.id, [t.id])

      await repo.deleteScrap(s.id)
      expect(await prisma.scraps.findUnique({ where: { id: s.id } })).toBeNull()
      expect(await prisma.tagScraps.count({ where: { scrapId: s.id } })).toBe(0)
    })

    it('SCRAP_REPO_016: 削除時に子スクラップのparentIdがnullに更新されること', async () => {
      const user = await createTestUser()
      const parent = await repo.addScrap({
        body: 'B',
        userId: user.id,
        parentId: null,
      })
      const child = await repo.addScrap({
        body: 'B',
        userId: user.id,
        parentId: parent.id,
      })
      await repo.deleteScrap(parent.id)
      const updated = await prisma.scraps.findUnique({
        where: { id: child.id },
      })
      expect(updated?.parentId).toBeNull()
    })
  })

  // --- getScrapIdsByTagIds ---
  describe('getScrapIdsByTagIds', () => {
    it('SCRAP_REPO_017: 指定した複数のタグIDを持つスクラップのIDリストを取得できること', async () => {
      const user = await createTestUser()
      const s1 = await repo.addScrap({
        body: 'B',
        userId: user.id,
        parentId: null,
      })
      const t1 = await prisma.tags.create({ data: { name: 'Tag1' } })
      await repo.registerTags(s1.id, [t1.id])

      const results = await repo.getScrapIdsByTagIds([t1.id])
      expect(results.map((r) => r.scrapId)).toContain(s1.id)
    })
  })
})
