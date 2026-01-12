import { Result } from '@praha/byethrow'
import z from 'zod'
import type { Tags } from '../../../generated/prisma/client.js'
import {
  ExistsTagNameError,
  InvalidQueryOptions,
  TagAttachedOthersResource,
  TagNotFoundError,
} from './error.js'
import { tagsRepository } from './repository.js'
import type { TagQueryOptions } from './type.js'

const queryOptionsSchema = z.union([
  z.object({
    artifactId: z.string(),
    scrapId: z.undefined(),
  }),
  z.object({
    artifactId: z.undefined(),
    scrapId: z.string(),
  }),
  z.object({
    artifactId: z.undefined(),
    scrapId: z.undefined(),
  }),
]) satisfies z.ZodType<TagQueryOptions>

export const tagsService = {
  getTags: async (options?: TagQueryOptions) => {
    if (
      options !== undefined &&
      !queryOptionsSchema.safeParse(options).success
    ) {
      return Result.fail(
        new InvalidQueryOptions(
          'ArtifactId and ScrapId cannot be set at the same time, and at least one must be provided.',
        ),
      )
    }
    return Result.succeed(await tagsRepository.getTags(options))
  },
  getTagById: async (tagId: string) => {
    const tag = await tagsRepository.getTagById(tagId)

    if (tag === null) {
      return Result.fail(new TagNotFoundError(tagId))
    }
    return Result.succeed(tag)
  },
  addTag: async (tag: Omit<Tags, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (await tagsRepository.isExistsTagName(tag.name)) {
      return Result.fail(new ExistsTagNameError(tag.name))
    }
    return Result.succeed(await tagsRepository.addTag(tag))
  },
  updateTag: async (
    tagId: string,
    data: Partial<Omit<Tags, 'id' | 'createdAt' | 'updatedAt'>>,
  ) => {
    if (!(await tagsRepository.isExistsTag(tagId))) {
      return Result.fail(new TagNotFoundError(tagId))
    }
    return await Result.succeed(tagsRepository.updateTag(tagId, data))
  },
  deleteTag: async (tagId: string, userId: string) => {
    const isAttached =
      (await tagsRepository.checkAttachedOthersArtifact(tagId, userId)) ||
      (await tagsRepository.checkAttachedOthersScrap(tagId, userId))
    if (isAttached) {
      return Result.fail(new TagAttachedOthersResource(tagId))
    }

    await tagsRepository.deleteTag(tagId)
    return Result.succeed(undefined)
  },
}
