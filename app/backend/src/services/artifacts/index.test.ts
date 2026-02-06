import { vi } from 'vitest'
import { prisma } from '../../lib/prisma.js'
import { createTestUser } from '../../testing/factories.js'
import { cleanupDatabase } from '../../testing/setup.js'
import { TagNotFoundError } from '../tags/error.js'
import { ArtifactNotFoundError, NotArtifactOwnerError } from './error.js'
import { artifactsService } from './index.js'

// LangChainのAI要約機能をモック化
vi.mock('../../lib/langchain/index.js', () => ({
  summarizePost: vi.fn().mockResolvedValue({ content: 'AI Generated Summary' }),
}))

describe('ArtifactsService', () => {
  // テスト実行ごとにデータベースをクリーンアップ
  beforeEach(async () => {
    await cleanupDatabase()
  })

  describe('getArtifacts', () => {
    // フィルタ条件なしで一覧が正しく取得できるか検証
    it('ARTIFACTS_SERVICE_001: 条件指定なしでアーティファクト一覧が取得できること', async () => {
      const user = await createTestUser()
      await prisma.artifacts.create({
        data: {
          title: 'Artifact 1',
          body: 'Body 1',
          userId: user.id,
          status: 'PUBLISHED',
        },
      })

      const result = await artifactsService.getArtifacts()

      expect(result.type).toBe('Success')
      if (result.type === 'Success') {
        expect(result.value).toHaveLength(1)
        expect(result.value[0].title).toBe('Artifact 1')
      }
    })

    // 特定のタグが付いた記事のみを抽出できるか検証
    it('ARTIFACTS_SERVICE_002: タグIDを指定して関連するアーティファクトのみが取得できること', async () => {
      const user = await createTestUser()
      const tag = await prisma.tags.create({ data: { name: 'TargetTag' } })
      const otherTag = await prisma.tags.create({ data: { name: 'OtherTag' } })

      // ターゲットタグを持つ記事
      await prisma.artifacts.create({
        data: {
          title: 'Target Artifact',
          body: 'Body',
          userId: user.id,
          tagArtifacts: { create: { tagId: tag.id } },
        },
      })

      // 別のタグを持つ記事
      await prisma.artifacts.create({
        data: {
          title: 'Other Artifact',
          body: 'Body',
          userId: user.id,
          tagArtifacts: { create: { tagId: otherTag.id } },
        },
      })

      const result = await artifactsService.getArtifacts({
        tagIds: [tag.id],
      })

      expect(result.type).toBe('Success')
      if (result.type === 'Success') {
        expect(result.value).toHaveLength(1)
        expect(result.value[0].title).toBe('Target Artifact')
      }
    })

    // フォロー中のユーザーの記事のみを抽出できるか検証
    it('ARTIFACTS_SERVICE_003: フォローしているユーザーのIDでフィルタリングして取得できること', async () => {
      const me = await createTestUser()
      const followee = await createTestUser()
      const stranger = await createTestUser()

      // フォロー関係を作成
      await prisma.userRelationships.create({
        data: { followerId: me.id, followeeId: followee.id },
      })

      // フォローしているユーザーの記事
      await prisma.artifacts.create({
        data: {
          title: 'Followee Artifact',
          body: '.',
          userId: followee.id,
        },
      })

      // フォローしていないユーザーの記事
      await prisma.artifacts.create({
        data: {
          title: 'Stranger Artifact',
          body: '.',
          userId: stranger.id,
        },
      })

      const result = await artifactsService.getArtifacts(undefined, {
        userId: me.id,
      })

      expect(result.type).toBe('Success')
      if (result.type === 'Success') {
        expect(result.value).toHaveLength(1)
        expect(result.value[0].userId).toBe(followee.id)
      }
    })
  })

  describe('getArtifactById', () => {
    // ID指定で特定の記事詳細が取得できるか検証
    it('ARTIFACTS_SERVICE_004: 存在するIDを指定してアーティファクトの詳細が取得できること', async () => {
      const user = await createTestUser()
      const artifact = await prisma.artifacts.create({
        data: {
          title: 'Detail Artifact',
          body: 'Body',
          userId: user.id,
        },
      })

      const result = await artifactsService.getArtifactById(artifact.id)

      expect(result.type).toBe('Success')
      if (result.type === 'Success') {
        expect(result.value.id).toBe(artifact.id)
      }
    })

    // 存在しないIDの場合に適切なエラーが返るか検証
    it('ARTIFACTS_SERVICE_005: 存在しないIDを指定した場合にArtifactNotFoundErrorが返ること', async () => {
      const result = await artifactsService.getArtifactById('non-existent-id')

      expect(result.type).toBe('Failure')
      if (result.type === 'Failure') {
        expect(result.error).toBeInstanceOf(ArtifactNotFoundError)
      }
    })
  })

  describe('addArtifact', () => {
    // 必須項目のみで記事作成が成功するか検証
    it('ARTIFACTS_SERVICE_006: 必須項目のみでアーティファクトが新規作成されること', async () => {
      const user = await createTestUser()
      const input = {
        title: 'New Artifact',
        body: 'New Body',
        userId: user.id,
        status: 'DRAFT',
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore: status型不一致回避(必要に応じて)
      const result = await artifactsService.addArtifact(input)

      expect(result.type).toBe('Success')
      if (result.type === 'Success') {
        expect(result.value.title).toBe(input.title)
        expect(result.value.publishedAt).toBeNull() // DRAFTなのでnull
      }
    })

    // 記事作成時にタグ紐付けが正しく行われるか検証
    it('ARTIFACTS_SERVICE_007: タグを指定してアーティファクトが作成されタグ紐付けが行われること', async () => {
      const user = await createTestUser()
      const tag = await prisma.tags.create({ data: { name: 'Tag1' } })

      const input = {
        title: 'Tagged Artifact',
        body: 'Body',
        userId: user.id,
        status: 'DRAFT',
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const result = await artifactsService.addArtifact(input, [tag.id])

      expect(result.type).toBe('Success')
      if (result.type === 'Success') {
        // DBで紐付け確認
        // 修正: findUnique => findFirst に変更し、複合キー名を気にせずフィールド指定する
        const relation = await prisma.tagArtifacts.findFirst({
          where: {
            artifactId: result.value.id,
            tagId: tag.id,
          },
        })
        expect(relation).not.toBeNull()
      }
    })

    // 存在しないタグを指定した際のエラーハンドリングを検証
    it('ARTIFACTS_SERVICE_008: 存在しないタグIDを指定した場合にTagNotFoundErrorが返ること', async () => {
      const user = await createTestUser()
      const input = {
        title: 'Fail Artifact',
        body: 'Body',
        userId: user.id,
        status: 'DRAFT',
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const result = await artifactsService.addArtifact(input, [
        'non-existent-tag-id',
      ])

      expect(result.type).toBe('Failure')
      if (result.type === 'Failure') {
        expect(result.error).toBeInstanceOf(TagNotFoundError)
      }
    })

    // 公開状態で作成した場合に公開日時が設定されるか検証
    it('ARTIFACTS_SERVICE_009: ステータスをPUBLISHEDにして作成した場合に公開日時(publishedAt)が設定されること', async () => {
      const user = await createTestUser()
      const input = {
        title: 'Published Artifact',
        body: 'Body',
        userId: user.id,
        status: 'PUBLISHED',
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const result = await artifactsService.addArtifact(input)

      expect(result.type).toBe('Success')
      if (result.type === 'Success') {
        expect(result.value.publishedAt).not.toBeNull()
        expect(result.value.publishedAt).toBeInstanceOf(Date)
      }
    })
  })

  describe('updateArtifact', () => {
    // 自身の記事内容を更新できるか検証
    it('ARTIFACTS_SERVICE_010: 自身のアーティファクトの内容を更新できること', async () => {
      const user = await createTestUser()
      const artifact = await prisma.artifacts.create({
        data: {
          title: 'Old Title',
          body: 'Old Body',
          userId: user.id,
        },
      })

      const updateContent = {
        content: { title: 'New Title' },
      }

      const result = await artifactsService.updateArtifact(
        artifact.id,
        user.id,
        updateContent,
      )

      expect(result.type).toBe('Success')
      const updated = await prisma.artifacts.findUnique({
        where: { id: artifact.id },
      })
      expect(updated?.title).toBe('New Title')
    })

    // ステータスを公開に変更した際、日時が更新されるか検証
    it('ARTIFACTS_SERVICE_012: ステータスをDRAFTからPUBLISHEDに変更した際に公開日時が更新されること', async () => {
      const user = await createTestUser()
      const artifact = await prisma.artifacts.create({
        data: {
          title: 'Draft',
          body: 'Body',
          userId: user.id,
          status: 'DRAFT',
          publishedAt: null,
        },
      })

      const updateContent = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
        content: { status: 'PUBLISHED' } as any,
      }

      await artifactsService.updateArtifact(artifact.id, user.id, updateContent)

      const updated = await prisma.artifacts.findUnique({
        where: { id: artifact.id },
      })
      expect(updated?.status).toBe('PUBLISHED')
      expect(updated?.publishedAt).not.toBeNull()
    })

    // 他人の記事を更新できないよう保護されているか検証
    it('ARTIFACTS_SERVICE_013: 他人のアーティファクトを更新しようとした場合にNotArtifactOwnerErrorが返ること', async () => {
      const owner = await createTestUser()
      const otherUser = await createTestUser()
      const artifact = await prisma.artifacts.create({
        data: {
          title: 'Owner Artifact',
          body: 'Body',
          userId: owner.id,
        },
      })

      const result = await artifactsService.updateArtifact(
        artifact.id,
        otherUser.id,
        { content: { title: 'Hacked' } },
      )

      expect(result.type).toBe('Failure')
      if (result.type === 'Failure') {
        expect(result.error).toBeInstanceOf(NotArtifactOwnerError)
      }
    })
  })

  describe('deleteArtifact', () => {
    // 自身の記事を削除できるか検証
    it('ARTIFACTS_SERVICE_014: 自身のアーティファクトを削除できること', async () => {
      const user = await createTestUser()
      const artifact = await prisma.artifacts.create({
        data: {
          title: 'To Delete',
          body: 'Body',
          userId: user.id,
        },
      })

      const result = await artifactsService.deleteArtifact(artifact.id, user.id)

      expect(result.type).toBe('Success')
      const deleted = await prisma.artifacts.findUnique({
        where: { id: artifact.id },
      })
      expect(deleted).toBeNull()
    })

    // 他人の記事を削除できないよう保護されているか検証
    it('ARTIFACTS_SERVICE_015: 他人のアーティファクトを削除しようとした場合にNotArtifactOwnerErrorが返ること', async () => {
      const owner = await createTestUser()
      const otherUser = await createTestUser()
      const artifact = await prisma.artifacts.create({
        data: {
          title: 'Owner Artifact',
          body: 'Body',
          userId: owner.id,
        },
      })

      const result = await artifactsService.deleteArtifact(
        artifact.id,
        otherUser.id,
      )

      expect(result.type).toBe('Failure')
      if (result.type === 'Failure') {
        expect(result.error).toBeInstanceOf(NotArtifactOwnerError)
      }
    })
  })

  describe('summarizeArtifact', () => {
    // AI要約を実行し、結果がDBに保存されるか検証
    it('ARTIFACTS_SERVICE_016: 指定したアーティファクトのAI要約が生成され保存されること', async () => {
      const user = await createTestUser()
      const artifact = await prisma.artifacts.create({
        data: {
          title: 'Long Article',
          body: 'This is a very long text...',
          userId: user.id,
          summaryByAI: null,
        },
      })

      const result = await artifactsService.summarizeArtifact(artifact.id)

      expect(result.type).toBe('Success')

      const updated = await prisma.artifacts.findUnique({
        where: { id: artifact.id },
      })
      // モックで返した値が入っているか
      expect(updated?.summaryByAI).toBe('AI Generated Summary')
    })

    // 存在しない記事への要約リクエストがエラーになるか検証
    it('ARTIFACTS_SERVICE_017: 存在しないアーティファクトの要約を試みた場合にArtifactNotFoundErrorが返ること', async () => {
      const result = await artifactsService.summarizeArtifact('non-existent-id')

      expect(result.type).toBe('Failure')
      if (result.type === 'Failure') {
        expect(result.error).toBeInstanceOf(ArtifactNotFoundError)
      }
    })

    it('ARTIFACTS_SERVICE_017: 存在しないアーティファクトの要約を試みた場合にArtifactNotFoundErrorが返ること', async () => {
      const result = await artifactsService.summarizeArtifact('non-existent-id')

      expect(result.type).toBe('Failure')
      if (result.type === 'Failure') {
        expect(result.error).toBeInstanceOf(ArtifactNotFoundError)
      }
    })
  })
})
