import { Result } from '@praha/byethrow'
import { isPublished } from '../../lib/typeCheckFilter.js'
import { searchRepository } from './repository.js'
import type { SearchResult, SearchType } from './type.js'

export const searchService = {
  searchByKeyword: async (keyword: string, type: SearchType = 'all') => {
    const handlers = {
      artifact: async () =>
        (await searchRepository.findArtifactsByKeyword(keyword)).map((a) => ({
          id: a.id,
          entityName: a.title,
        })),
      scrap: async () =>
        (await searchRepository.findScrapsByKeyword(keyword)).map((s) => ({
          id: s.id,
          entityName: s.body,
        })),
      user: async () =>
        (await searchRepository.findUsersByKeyword(keyword)).map((u) => ({
          id: u.id,
          entityName: u.userName,
        })),
      tag: async () =>
        (await searchRepository.findTagsByKeyword(keyword)).map((t) => ({
          id: t.id,
          entityName: t.name,
        })),
    } satisfies Record<
      Exclude<SearchType, 'all'>,
      () => Promise<SearchResult[]>
    >

    if (type === 'all') {
      const [artifact, scrap, user, tag] = await Promise.all([
        handlers.artifact(),
        handlers.scrap(),
        handlers.user(),
        handlers.tag(),
      ])
      return Result.succeed({ artifact, scrap, user, tag })
    }

    return Result.succeed({
      artifact: type === 'artifact' ? await handlers.artifact() : [],
      scrap: type === 'scrap' ? await handlers.scrap() : [],
      user: type === 'user' ? await handlers.user() : [],
      tag: type === 'tag' ? await handlers.tag() : [],
    })
  },
  searchArtifacts: async (keyword: string) => {
    return Result.succeed(
      (await searchRepository.findArtifactsByKeyword(keyword)).filter(
        isPublished,
      ),
    )
  },
  searchScraps: async (keyword: string) => {
    return Result.succeed(await searchRepository.findScrapsByKeyword(keyword))
  },
  searchUsers: async (keyword: string) => {
    return Result.succeed(await searchRepository.findUsersByKeyword(keyword))
  },
  searchTags: async (keyword: string) => {
    return Result.succeed(await searchRepository.findTagsByKeyword(keyword))
  },
}
