import { prisma } from '../../lib/prisma.js'
import { createTestUser } from '../../testing/factories.js'
import { cleanupDatabase } from '../../testing/setup.js'
import {
  AlreadyFollowingError,
  CannotFollowSelfError,
  UserNotFoundError,
} from './error.js'
import { usersService } from './index.js'

describe('UsersService', () => {
  // テスト実行ごとにデータベースをクリーンアップ
  beforeEach(async () => {
    await cleanupDatabase()
  })

  describe('getUserDetail', () => {
    // ユーザー詳細情報の取得成功を検証
    it('USERS_SERVICE_001: 存在するユーザーIDを指定して詳細情報が取得できること', async () => {
      const user = await createTestUser()

      const result = await usersService.getUserDetail(user.id)

      expect(result.type).toBe('Success')
      if (result.type === 'Success') {
        expect(result.value.id).toBe(user.id)
        expect(result.value.avatarUrl).toBe(user.avatarUrl)
      }
    })

    // 存在しないユーザーID指定時のエラーを検証
    it('USERS_SERVICE_002: 存在しないユーザーIDを指定した場合にUserNotFoundErrorが返ること', async () => {
      const result = await usersService.getUserDetail('non-existent-id')

      expect(result.type).toBe('Failure')
      if (result.type === 'Failure') {
        expect(result.error).toBeInstanceOf(UserNotFoundError)
      }
    })
  })

  describe('editUser', () => {
    // ユーザー情報の更新がDBに反映されるか検証
    it('USERS_SERVICE_003: 正しい入力値でユーザー情報（名前・自己紹介等）が更新されること', async () => {
      const user = await createTestUser()
      const updateInput = {
        userName: 'Updated Name',
        bio: 'Updated Bio',
        avatarUrl: 'https://example.com/new.png',
      }

      const result = await usersService.editUser(user.id, updateInput)

      expect(result.type).toBe('Success')
      if (result.type === 'Success') {
        expect(result.value.userName).toBe(updateInput.userName)
        expect(result.value.bio).toBe(updateInput.bio)
        expect(result.value.avatarUrl).toBe(updateInput.avatarUrl)
      }

      // DBも更新されているか確認
      const updatedInDb = await prisma.users.findUnique({
        where: { id: user.id },
      })
      expect(updatedInDb?.userName).toBe(updateInput.userName)
    })
  })

  describe('followUser', () => {
    // 他ユーザーへのフォロー成功とリレーション作成を検証
    it('USERS_SERVICE_004: 別のユーザーをフォローできること', async () => {
      const userA = await createTestUser() // フォローする側
      const userB = await createTestUser() // フォローされる側

      const result = await usersService.followUser(userA.id, userB.id)

      expect(result.type).toBe('Success')

      // DBでリレーション確認
      const rel = await prisma.userRelationships.findUnique({
        where: {
          followerId_followeeId: {
            followerId: userA.id,
            followeeId: userB.id,
          },
        },
      })
      expect(rel).not.toBeNull()
    })

    // 自分自身へのフォローがエラーになるか検証
    it('USERS_SERVICE_005: 自分自身をフォローしようとした場合にCannotFollowSelfErrorが返ること', async () => {
      const user = await createTestUser()

      const result = await usersService.followUser(user.id, user.id)

      expect(result.type).toBe('Failure')
      if (result.type === 'Failure') {
        expect(result.error).toBeInstanceOf(CannotFollowSelfError)
      }
    })

    // 重複フォローがエラーになるか検証
    it('USERS_SERVICE_006: 既にフォローしているユーザーを再度フォローしようとした場合にAlreadyFollowingErrorが返ること', async () => {
      const userA = await createTestUser()
      const userB = await createTestUser()

      // 1回目: 成功させる（またはDB直接投入）
      await usersService.followUser(userA.id, userB.id)

      // 2回目: エラーになるはず
      const result = await usersService.followUser(userA.id, userB.id)

      expect(result.type).toBe('Failure')
      if (result.type === 'Failure') {
        expect(result.error).toBeInstanceOf(AlreadyFollowingError)
      }
    })
  })

  describe('cancelFollower', () => {
    // フォロー解除とリレーション削除を検証
    it('USERS_SERVICE_007: フォローしているユーザーのフォローを解除できること', async () => {
      const userA = await createTestUser()
      const userB = await createTestUser()

      // 事前にフォロー状態を作成
      await usersService.followUser(userA.id, userB.id)

      // フォロー解除
      const result = await usersService.cancelFollower(userA.id, userB.id)

      expect(result.type).toBe('Success')

      // DBから消えているか確認
      const rel = await prisma.userRelationships.findUnique({
        where: {
          followerId_followeeId: {
            followerId: userA.id,
            followeeId: userB.id,
          },
        },
      })
      expect(rel).toBeNull()
    })
  })

  describe('getFollowers / getFollowees', () => {
    // フォロワー一覧が正しく取得できるか検証
    it('USERS_SERVICE_008: ユーザーのフォロワー一覧が取得できること', async () => {
      const targetUser = await createTestUser()
      const followerA = await createTestUser()
      const followerB = await createTestUser()

      // AとBがtargetをフォロー
      await usersService.followUser(followerA.id, targetUser.id)
      await usersService.followUser(followerB.id, targetUser.id)

      const result = await usersService.getFollowers(targetUser.id)

      expect(result.type).toBe('Success')
      if (result.type === 'Success') {
        expect(result.value).toHaveLength(2)
        // 取得順序の保証がない場合はIDが含まれているかで判定
        const ids = result.value.map((u) => u.id)
        expect(ids).toContain(followerA.id)
        expect(ids).toContain(followerB.id)
      }
    })

    // フォロー中ユーザー一覧が正しく取得できるか検証
    it('USERS_SERVICE_009: ユーザーがフォローしているユーザー一覧（フォロー中）が取得できること', async () => {
      const user = await createTestUser()
      const followeeA = await createTestUser()
      const followeeB = await createTestUser()

      // userがAとBをフォロー
      await usersService.followUser(user.id, followeeA.id)
      await usersService.followUser(user.id, followeeB.id)

      const result = await usersService.getFollowees(user.id)

      expect(result.type).toBe('Success')
      if (result.type === 'Success') {
        expect(result.value).toHaveLength(2)
        const ids = result.value.map((u) => u.id)
        expect(ids).toContain(followeeA.id)
        expect(ids).toContain(followeeB.id)
      }
    })
  })

  describe('getContentsByUserId', () => {
    // ユーザー作成のコンテンツ一覧取得を検証
    it('USERS_SERVICE_010: ユーザーに紐づくコンテンツ一覧が取得できること', async () => {
      const user = await createTestUser()

      await prisma.artifacts.create({
        data: {
          title: 'Test Scrap',
          body: 'This is a test scrap content.',
          userId: user.id,
          publishedAt: new Date(),
        },
      })

      const result = await usersService.getContentsByUserId(user.id)

      expect(result.type).toBe('Success')
      if (result.type === 'Success') {
        // Artifactsが1件取得できるはず
        expect(result.value?.artifacts).toHaveLength(1)
        expect(result.value?.artifacts[0].title).toBe('Test Scrap')
      }
    })
  })
})
