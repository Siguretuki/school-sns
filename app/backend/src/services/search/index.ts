import { Result } from '@praha/byethrow'
import { toIsLiked } from '../../lib/formatter.js'
import { isPublished } from '../../lib/typeCheckFilter.js'
import { searchRepository } from './repository.js'

export const searchService = {
  searchArtifacts: async (keyword: string) => {
    return Result.succeed(
      (await searchRepository.findArtifactsByKeyword(keyword)).filter(
        isPublished,
      ),
    )
  },
  searchScraps: async (keyword: string, userId: string) => {
    return Result.succeed(
      (await searchRepository.findScrapsByKeyword(keyword, userId)).map(
        toIsLiked,
      ),
    )
  },
  searchUsers: async (keyword: string) => {
    return Result.succeed(await searchRepository.findUsersByKeyword(keyword))
  },
  searchTags: async (keyword: string) => {
    return Result.succeed(await searchRepository.findTagsByKeyword(keyword))
  },
}
