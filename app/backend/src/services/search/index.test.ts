import { prisma } from '../../lib/prisma.js'
import { createTestUser } from '../../testing/factories.js'
import { cleanupDatabase } from '../../testing/setup.js'
import { searchService } from './index.js'

describe('SearchService', () => {
  // テスト実行ごとにデータベースをクリーンアップ
  beforeEach(async () => {
    await cleanupDatabase()
  })

  // 共通のテストデータ作成ヘルパー
  const createSearchData = async (keyword: string) => {
    const user = await createTestUser({ name: `${keyword} User` })

    const artifact = await prisma.artifacts.create({
      data: {
        title: `${keyword} Artifact`,
        body: 'body',
        userId: user.id,
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    })

    const scrap = await prisma.scraps.create({
      data: {
        body: `${keyword} Scrap`,
        userId: user.id,
      },
    })

    const tag = await prisma.tags.create({
      data: {
        name: `${keyword}Tag`,
      },
    })

    return { user, artifact, scrap, tag }
  }

  describe('searchByKeyword', () => {
    // 検索タイプ指定なしで全カテゴリから結果が返るか検証
    it('SEARCH_SERVICE_001: 検索タイプをall（または省略）にした場合に全てのカテゴリから検索結果が返ること', async () => {
      const keyword = 'Common'
      await createSearchData(keyword)

      // type省略時は 'all' 扱い
      const result = await searchService.searchByKeyword(keyword)

      expect(result.type).toBe('Success')
      if (result.type === 'Success') {
        const { artifact, scrap, user, tag } = result.value
        expect(artifact).toHaveLength(1)
        expect(artifact[0].entityName).toBe(`${keyword} Artifact`)

        expect(scrap).toHaveLength(1)
        expect(scrap[0].entityName).toBe(`${keyword} Scrap`)

        expect(user).toHaveLength(1)
        expect(user[0].entityName).toBe(`${keyword} User`)

        expect(tag).toHaveLength(1)
        expect(tag[0].entityName).toBe(`${keyword}Tag`)
      }
    })

    // アーティファクトのみに絞り込まれるか検証
    it('SEARCH_SERVICE_002: 検索タイプをartifactにした場合にアーティファクトのみが検索結果に含まれること', async () => {
      const keyword = 'Target'
      await createSearchData(keyword)

      const result = await searchService.searchByKeyword(keyword, 'artifact')

      expect(result.type).toBe('Success')
      if (result.type === 'Success') {
        expect(result.value.artifact).toHaveLength(1)
        expect(result.value.scrap).toHaveLength(0)
        expect(result.value.user).toHaveLength(0)
        expect(result.value.tag).toHaveLength(0)
      }
    })

    // スクラップのみに絞り込まれるか検証
    it('SEARCH_SERVICE_003: 検索タイプをscrapにした場合にスクラップのみが検索結果に含まれること', async () => {
      const keyword = 'Target'
      await createSearchData(keyword)

      const result = await searchService.searchByKeyword(keyword, 'scrap')

      expect(result.type).toBe('Success')
      if (result.type === 'Success') {
        expect(result.value.scrap).toHaveLength(1)
        expect(result.value.artifact).toHaveLength(0)
      }
    })

    // ユーザーのみに絞り込まれるか検証
    it('SEARCH_SERVICE_004: 検索タイプをuserにした場合にユーザーのみが検索結果に含まれること', async () => {
      const keyword = 'Target'
      await createSearchData(keyword)

      const result = await searchService.searchByKeyword(keyword, 'user')

      expect(result.type).toBe('Success')
      if (result.type === 'Success') {
        expect(result.value.user).toHaveLength(1)
        expect(result.value.artifact).toHaveLength(0)
      }
    })

    // タグのみに絞り込まれるか検証
    it('SEARCH_SERVICE_005: 検索タイプをtagにした場合にタグのみが検索結果に含まれること', async () => {
      const keyword = 'Target'
      await createSearchData(keyword)

      const result = await searchService.searchByKeyword(keyword, 'tag')

      expect(result.type).toBe('Success')
      if (result.type === 'Success') {
        expect(result.value.tag).toHaveLength(1)
        expect(result.value.artifact).toHaveLength(0)
      }
    })
  })

  describe('searchArtifacts', () => {
    // 公開済みの記事が正しくヒットするか検証
    it('SEARCH_SERVICE_006: キーワードに一致する公開済みアーティファクトが取得できること', async () => {
      const keyword = 'Public'
      const user = await createTestUser()
      await prisma.artifacts.create({
        data: {
          title: `${keyword} Content`,
          body: 'body',
          userId: user.id,
          status: 'PUBLISHED',
          publishedAt: new Date(),
        },
      })

      const result = await searchService.searchArtifacts(keyword)

      expect(result.type).toBe('Success')
      if (result.type === 'Success') {
        expect(result.value).toHaveLength(1)
        expect(result.value[0].title).toContain(keyword)
      }
    })

    // 下書き記事が検索結果から除外されるか検証
    it('SEARCH_SERVICE_007: キーワードに一致しても下書き（publishedAtがnull）のアーティファクトは除外されること', async () => {
      const keyword = 'Draft'
      const user = await createTestUser()

      // 下書き記事を作成 (publishedAt: null)
      await prisma.artifacts.create({
        data: {
          title: `${keyword} Content`,
          body: 'body',
          userId: user.id,
          status: 'DRAFT',
          publishedAt: null,
        },
      })

      const result = await searchService.searchArtifacts(keyword)

      expect(result.type).toBe('Success')
      if (result.type === 'Success') {
        // ヒットしないはず
        expect(result.value).toHaveLength(0)
      }
    })
  })

  describe('searchScraps', () => {
    // スクラップがキーワード検索できるか検証
    it('SEARCH_SERVICE_008: キーワードに一致するスクラップが取得できること', async () => {
      const keyword = 'ScrapInfo'
      const user = await createTestUser()
      await prisma.scraps.create({
        data: {
          body: `${keyword} desu`,
          userId: user.id,
        },
      })

      const result = await searchService.searchScraps(keyword)

      expect(result.type).toBe('Success')
      if (result.type === 'Success') {
        expect(result.value).toHaveLength(1)
        expect(result.value[0].body).toContain(keyword)
      }
    })
  })

  describe('searchUsers', () => {
    // ユーザーがキーワード検索できるか検証
    it('SEARCH_SERVICE_009: キーワードに一致するユーザーが取得できること', async () => {
      const keyword = 'Alpha'
      await createTestUser({ name: `${keyword} User` })

      const result = await searchService.searchUsers(keyword)

      expect(result.type).toBe('Success')
      if (result.type === 'Success') {
        expect(result.value).toHaveLength(1)
        expect(result.value[0].userName).toContain(keyword)
      }
    })
  })

  describe('searchTags', () => {
    // タグがキーワード検索できるか検証
    it('SEARCH_SERVICE_010: キーワードに一致するタグが取得できること', async () => {
      const keyword = 'Ruby'
      await prisma.tags.create({ data: { name: `${keyword}OnRails` } })

      const result = await searchService.searchTags(keyword)

      expect(result.type).toBe('Success')
      if (result.type === 'Success') {
        expect(result.value).toHaveLength(1)
        expect(result.value[0].name).toContain(keyword)
      }
    })
  })
})
