import { prisma } from '../../lib/prisma.js'
import { createTestUser } from '../../testing/factories.js'
import { cleanupDatabase } from '../../testing/setup.js'
import {
  ExistsTagNameError,
  InvalidQueryOptions,
  TagAttachedOthersResource,
  TagNotFoundError,
} from './error.js'
import { tagsService } from './index.js'

describe('TagsService', () => {
  // テスト実行ごとにデータベースをクリーンアップ
  beforeEach(async () => {
    await cleanupDatabase()
  })

  describe('getTags', () => {
    // オプション指定なしで全タグが取得できるか検証
    it('TAGS_SERVICE_001: オプションなしでタグ一覧が取得できること', async () => {
      await prisma.tags.create({ data: { name: 'Tag A' } })
      await prisma.tags.create({ data: { name: 'Tag B' } })

      const result = await tagsService.getTags()

      expect(result.type).toBe('Success')
      if (result.type === 'Success') {
        expect(result.value).toHaveLength(2)
      }
    })

    // 特定のアーティファクトに関連するタグのみ取得できるか検証
    it('TAGS_SERVICE_002: ArtifactIDを指定して関連するタグ一覧が取得できること', async () => {
      const user = await createTestUser()
      const tag = await prisma.tags.create({ data: { name: 'ArtifactTag' } })
      await prisma.tags.create({ data: { name: 'OtherTag' } })

      // Artifactに紐付け
      await prisma.artifacts.create({
        data: {
          title: 'Title',
          body: 'Body',
          userId: user.id,
          tagArtifacts: {
            create: { tagId: tag.id },
          },
        },
      })

      const artifact = await prisma.artifacts.findFirst()
      if (!artifact) throw new Error('Artifact creation failed')

      const result = await tagsService.getTags({ artifactId: artifact.id })

      expect(result.type).toBe('Success')
      if (result.type === 'Success') {
        expect(result.value).toHaveLength(1)
        expect(result.value[0].name).toBe('ArtifactTag')
      }
    })

    // 排他オプションを同時指定した際のエラーハンドリングを検証
    it('TAGS_SERVICE_004: ArtifactIDとScrapIDを同時に指定した場合にInvalidQueryOptionsエラーが返ること', async () => {
      const result = await tagsService.getTags({
        artifactId: 'some-id',
        scrapId: 'some-id',
      })

      expect(result.type).toBe('Failure')
      if (result.type === 'Failure') {
        expect(result.error).toBeInstanceOf(InvalidQueryOptions)
      }
    })
  })

  describe('getTagById', () => {
    // ID指定でタグ詳細が取得できるか検証
    it('TAGS_SERVICE_005: 存在するタグIDを指定して詳細情報が取得できること', async () => {
      const tag = await prisma.tags.create({ data: { name: 'Target' } })
      const result = await tagsService.getTagById(tag.id)

      expect(result.type).toBe('Success')
      if (result.type === 'Success') {
        expect(result.value.name).toBe('Target')
      }
    })

    // 存在しないIDを指定した際のエラーハンドリングを検証
    it('TAGS_SERVICE_006: 存在しないタグIDを指定した場合にTagNotFoundErrorが返ること', async () => {
      const result = await tagsService.getTagById('non-existent')

      expect(result.type).toBe('Failure')
      if (result.type === 'Failure') {
        expect(result.error).toBeInstanceOf(TagNotFoundError)
      }
    })
  })

  describe('addTag', () => {
    // 重複しない名前で新規タグ作成が成功するか検証
    it('TAGS_SERVICE_007: 重複しない名前でタグを新規作成できること', async () => {
      const result = await tagsService.addTag({
        name: 'New Tag',
        slug: null,
      })

      expect(result.type).toBe('Success')
      if (result.type === 'Success') {
        expect(result.value.name).toBe('New Tag')
      }
    })

    // 既存のタグ名での作成が拒否されるか検証
    it('TAGS_SERVICE_008: 既に存在する名前でタグを作成しようとした場合にExistsTagNameErrorが返ること', async () => {
      await prisma.tags.create({ data: { name: 'Duplicate' } })

      const result = await tagsService.addTag({
        name: 'Duplicate',
        slug: null,
      })

      expect(result.type).toBe('Failure')
      if (result.type === 'Failure') {
        expect(result.error).toBeInstanceOf(ExistsTagNameError)
      }
    })
  })

  describe('updateTag', () => {
    // タグ名の更新が成功するか検証
    it('TAGS_SERVICE_009: 存在するタグの名前を更新できること', async () => {
      const tag = await prisma.tags.create({ data: { name: 'Old Name' } })

      const result = await tagsService.updateTag(tag.id, { name: 'New Name' })

      expect(result.type).toBe('Success')

      const updated = await prisma.tags.findUnique({ where: { id: tag.id } })
      expect(updated?.name).toBe('New Name')
    })

    // 存在しないタグへの更新リクエストがエラーになるか検証
    it('TAGS_SERVICE_010: 存在しないタグを更新しようとした場合にTagNotFoundErrorが返ること', async () => {
      const result = await tagsService.updateTag('non-existent', {
        name: 'New',
      })

      expect(result.type).toBe('Failure')
      if (result.type === 'Failure') {
        expect(result.error).toBeInstanceOf(TagNotFoundError)
      }
    })
  })

  describe('deleteTag', () => {
    // 使用されていないタグを削除できるか検証
    it('TAGS_SERVICE_011: 誰のリソースにも使用されていないタグを削除できること', async () => {
      const user = await createTestUser()
      const tag = await prisma.tags.create({ data: { name: 'Unused Tag' } })

      const result = await tagsService.deleteTag(tag.id, user.id)

      expect(result.type).toBe('Success')
      const deleted = await prisma.tags.findUnique({ where: { id: tag.id } })
      expect(deleted).toBeNull()
    })

    // 自身のリソースでのみ使用されているタグは削除可能か検証
    it('TAGS_SERVICE_012: 自身のアーティファクトのみに使用されているタグを削除できること', async () => {
      const user = await createTestUser()
      const tag = await prisma.tags.create({ data: { name: 'My Tag' } })

      // 自身のアーティファクトで使用
      await prisma.artifacts.create({
        data: {
          title: 'My Artifact',
          body: '.',
          userId: user.id,
          tagArtifacts: { create: { tagId: tag.id } },
        },
      })

      const result = await tagsService.deleteTag(tag.id, user.id)

      expect(result.type).toBe('Success')
      // タグ自体が消えていること
      const deleted = await prisma.tags.findUnique({ where: { id: tag.id } })
      expect(deleted).toBeNull()
    })

    // 他人のアーティファクトで使用されているタグは削除不可か検証
    it('TAGS_SERVICE_013: 他人のアーティファクトに使用されているタグを削除しようとした場合にTagAttachedOthersResourceエラーが返ること', async () => {
      const me = await createTestUser()
      const other = await createTestUser()
      const tag = await prisma.tags.create({ data: { name: 'Shared Tag' } })

      // 他人のアーティファクトで使用
      await prisma.artifacts.create({
        data: {
          title: 'Other Artifact',
          body: '.',
          userId: other.id,
          tagArtifacts: { create: { tagId: tag.id } },
        },
      })

      const result = await tagsService.deleteTag(tag.id, me.id)

      expect(result.type).toBe('Failure')
      if (result.type === 'Failure') {
        expect(result.error).toBeInstanceOf(TagAttachedOthersResource)
      }
    })

    // 他人のスクラップで使用されているタグは削除不可か検証
    it('TAGS_SERVICE_014: 他人のスクラップに使用されているタグを削除しようとした場合にTagAttachedOthersResourceエラーが返ること', async () => {
      const me = await createTestUser()
      const other = await createTestUser()
      const tag = await prisma.tags.create({ data: { name: 'Scrap Tag' } })

      // 他人のスクラップで使用
      await prisma.scraps.create({
        data: {
          body: '.',
          userId: other.id,
          tagScraps: { create: { tagId: tag.id } },
        },
      })

      const result = await tagsService.deleteTag(tag.id, me.id)

      expect(result.type).toBe('Failure')
      if (result.type === 'Failure') {
        expect(result.error).toBeInstanceOf(TagAttachedOthersResource)
      }
    })
  })
})
