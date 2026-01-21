import { UserRole } from '../../../generated/prisma/enums.js'
import { prisma } from '../../lib/prisma.js'
import { createTestUser } from '../../testing/factories.js'
import { usersRepository } from './repository.js'

describe('UserRepository', () => {
  const repo = usersRepository

  // 依存関係の深い順に削除（子レコードから消す）
  beforeEach(async () => {
    await prisma.userRelationships.deleteMany()
    await prisma.artifacts.deleteMany()
    await prisma.users.deleteMany()
  })

  describe('getById / updateById', () => {
    it('USER_REPO_001: 存在するIDを指定してユーザーを取得できること', async () => {
      const user = await createTestUser({ role: UserRole.STUDENT })
      const found = await repo.getById(user.id)
      expect(found?.id).toBe(user.id)
    })

    it('USER_REPO_002: 存在しないIDを指定した際にnullが返ること', async () => {
      const found = await repo.getById('non-existent-id')
      expect(found).toBeNull()
    })

    it('USER_REPO_003: 既存ユーザーの情報を正常に更新できること', async () => {
      const user = await createTestUser({
        role: UserRole.STUDENT,
        name: 'Old Name',
      })
      const updateData = {
        userName: 'New Name',
        bio: 'Hello',
        avatarUrl: 'http://...',
      }

      const updated = await repo.updateById(user.id, updateData)
      expect(updated).toEqual(
        expect.objectContaining({
          userName: updateData.userName,
          bio: updateData.bio,
          avatarUrl: updateData.avatarUrl,
        }),
      )
    })

    it('USER_REPO_004: 存在しないIDの更新を試みた際にエラーが発生すること', async () => {
      await expect(
        repo.updateById('non-existent-id', { userName: 'New' }),
      ).rejects.toThrow()
    })
  })

  describe('Follow Logic (followUser / isFollowed / cancelFollower)', () => {
    it('USER_REPO_005: ユーザーを正常にフォローできリレーションが作成されること', async () => {
      const follower = await createTestUser({
        role: UserRole.STUDENT,
        email: 'a@ex.com',
      })
      const followee = await createTestUser({
        role: UserRole.STUDENT,
        email: 'b@ex.com',
      })

      await repo.followUser(follower.id, followee.id)

      const isFollowed = await repo.isFollowed(follower.id, followee.id)
      expect(isFollowed).toBe(true)
    })

    it('USER_REPO_006: 同一ユーザーを二重にフォローした際にエラーが発生すること', async () => {
      const follower = await createTestUser({
        role: UserRole.STUDENT,
        email: 'a@ex.com',
      })
      const followee = await createTestUser({
        role: UserRole.STUDENT,
        email: 'b@ex.com',
      })

      await repo.followUser(follower.id, followee.id)
      // Prismaの一意制約(Unique constraint)エラーを期待
      await expect(repo.followUser(follower.id, followee.id)).rejects.toThrow()
    })

    it('USER_REPO_007: 自分自身をフォローしようとした際の挙動確認', async () => {
      const user = await createTestUser({ role: UserRole.STUDENT })
      await expect(repo.followUser(user.id, user.id)).rejects.toThrow()
    })

    it('USER_REPO_008: フォロー中であればtrueそうでなければfalseを返すこと', async () => {
      const follower = await createTestUser({
        role: UserRole.STUDENT,
        email: 'a@ex.com',
      })
      const followee = await createTestUser({
        role: UserRole.STUDENT,
        email: 'b@ex.com',
      })

      const isNotFollowed = await repo.isFollowed(follower.id, followee.id)
      expect(isNotFollowed).toBe(false)

      await repo.followUser(follower.id, followee.id)

      const isFollowed = await repo.isFollowed(follower.id, followee.id)
      expect(isFollowed).toBe(true)
    })

    it('USER_REPO_009: フォローを正常に解除(キャンセル)できること', async () => {
      const follower = await createTestUser({
        role: UserRole.STUDENT,
        email: 'a@ex.com',
      })
      const followee = await createTestUser({
        role: UserRole.STUDENT,
        email: 'b@ex.com',
      })

      await repo.followUser(follower.id, followee.id)
      await repo.cancelFollower(follower.id, followee.id)

      const isFollowed = await repo.isFollowed(follower.id, followee.id)
      expect(isFollowed).toBe(false)
    })

    it('USER_REPO_010: 存在しないフォロー関係を解除しようとしてもエラーにならないこと', async () => {
      const u1 = await createTestUser({
        role: UserRole.STUDENT,
        email: '1@ex.com',
      })
      const u2 = await createTestUser({
        role: UserRole.STUDENT,
        email: '2@ex.com',
      })

      await expect(repo.cancelFollower(u1.id, u2.id)).resolves.not.toThrow()
    })
  })

  describe('List Fetching (getFollowers / getFollowees / getContents)', () => {
    it('USER_REPO_011: 特定のユーザーをフォローしている全員のリストを正しく取得できること', async () => {
      const target = await createTestUser({
        role: UserRole.TEACHER,
        email: 't@ex.com',
      })
      const f1 = await createTestUser({
        role: UserRole.STUDENT,
        email: 's1@ex.com',
      })
      const f2 = await createTestUser({
        role: UserRole.STUDENT,
        email: 's2@ex.com',
      })

      await repo.followUser(f1.id, target.id)
      await repo.followUser(f2.id, target.id)

      const followers = await repo.getFollowers(target.id)
      expect(followers).toHaveLength(2)
      expect(followers.map((f) => f.id)).toContain(f1.id)
    })

    it('USER_REPO_012: 特定のユーザーがフォローしている全員のリストを正しく取得できること', async () => {
      const me = await createTestUser({
        role: UserRole.STUDENT,
        email: 'me@ex.com',
      })
      const target = await createTestUser({
        role: UserRole.TEACHER,
        email: 'target@ex.com',
      })

      await repo.followUser(me.id, target.id)

      const followees = await repo.getFollowees(me.id)
      expect(followees).toHaveLength(1)
      expect(followees[0].id).toBe(target.id)
    })

    it('USER_REPO_014: コンテンツを持たないユーザーの場合に空配列を返すこと', async () => {
      const user = await createTestUser({ role: UserRole.STUDENT })
      const contents = await repo.getContentsByUserId(user.id)
      expect(contents).toEqual([]) // 空配列であることを確認
    })

    it('USER_REPO_013: ユーザーに紐づくコンテンツ(Artifacts)の一覧を正しく取得できること', async () => {
      const user = await createTestUser({ role: UserRole.STUDENT })
      await prisma.artifacts.create({
        data: {
          userId: user.id,
          title: 'Test Artifact',
          body: 'This is a test body content',
        },
      })

      const contents = await repo.getContentsByUserId(user.id)
      expect(contents).toHaveLength(1)
      expect(contents[0].userId).toBe(user.id)
    })
  })

  describe('Advanced (Cascade / Partial Update)', () => {
    it('USER_REPO_015: ユーザー削除時に紐づくフォロー関係が適切に処理されること', async () => {
      const u1 = await createTestUser({
        role: UserRole.STUDENT,
        email: '1@ex.com',
      })
      const u2 = await createTestUser({
        role: UserRole.STUDENT,
        email: '2@ex.com',
      })
      await repo.followUser(u1.id, u2.id)

      // ユーザーを直接消す（Prismaのカスケード設定を確認）
      await prisma.users.delete({ where: { id: u1.id } })

      const relation = await prisma.userRelationships.findFirst({
        where: { followerId: u1.id },
      })
      expect(relation).toBeNull()
    })

    it('USER_REPO_016: updateByIdで一部の項目のみ更新した際に他の項目が維持されること', async () => {
      const user = await createTestUser({
        role: UserRole.STUDENT,
        name: 'Orig',
      })
      // bioが入っている状態にする
      await prisma.users.update({
        where: { id: user.id },
        data: { bio: 'Keep me' },
      })

      // 名前だけ更新
      await repo.updateById(user.id, { userName: 'New' })

      const updated = await repo.getById(user.id)
      expect(updated?.userName).toBe('New')
      expect(updated?.bio).toBe('Keep me') // bioが維持されているか
    })

    it('USER_REPO_017: フォロー解除直後に再度同じ相手をフォローできること', async () => {
      const f = await createTestUser({
        role: UserRole.STUDENT,
        email: 'f@ex.com',
      })
      const t = await createTestUser({
        role: UserRole.STUDENT,
        email: 't@ex.com',
      })

      await repo.followUser(f.id, t.id)
      await repo.cancelFollower(f.id, t.id)
      await expect(repo.followUser(f.id, t.id)).resolves.not.toThrow()
    })

    it('USER_REPO_018: 相互フォロー状態でリストが正しいこと', async () => {
      const u1 = await createTestUser({
        role: UserRole.STUDENT,
        email: '1@ex.com',
      })
      const u2 = await createTestUser({
        role: UserRole.STUDENT,
        email: '2@ex.com',
      })

      await repo.followUser(u1.id, u2.id)
      await repo.followUser(u2.id, u1.id)

      const followersOfU1 = await repo.getFollowers(u1.id)
      const followeesOfU1 = await repo.getFollowees(u1.id)

      expect(followersOfU1[0].id).toBe(u2.id)
      expect(followeesOfU1[0].id).toBe(u2.id)
    })
  })
})
