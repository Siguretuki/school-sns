import { Result } from '@praha/byethrow'
import type { Artifacts } from '../../../generated/prisma/client.js'
import { summarizePost } from '../../lib/langchain/index.js'
import { TagNotFoundError } from '../tags/error.js'
import { tagsRepository } from '../tags/repository.js'
import {
  NotArtifactOwnerError,
  ArtifactNotFoundError,
  FailedToSummarizeError,
} from './error.js'
import { artifactsRepository } from './repository.js'
import type { ArtifactOptions } from './type.js'

export const artifactsService = {
  getArtifacts: async (
    options?: ArtifactOptions & { tagIds?: string[] },
    followingUserFilter?: { userId: string },
  ) => {
    const userIds =
      followingUserFilter !== undefined
        ? (
            await artifactsRepository.getFollowingUserIds(
              followingUserFilter.userId,
            )
          ).map(({ followeeId }) => followeeId)
        : undefined

    const ids = options?.tagIds
      ? (await artifactsRepository.getArtifactIdsByTagIds(options.tagIds)).map(
          ({ artifactId }) => artifactId,
        )
      : undefined
    const artifacts = await artifactsRepository.getArtifacts({
      ...options,
      ids,
      userIds,
    })
    return Result.succeed(artifacts)
  },
  getArtifactById: async (artifactId: string) => {
    const artifact = await artifactsRepository.getArtifactById(artifactId)
    if (artifact === null) {
      return Result.fail(new ArtifactNotFoundError(artifactId))
    }
    return Result.succeed(artifact)
  },
  deleteArtifact: async (artifactId: string, userId: string) => {
    if (!(await artifactsRepository.isOwnArtifact(artifactId, userId))) {
      return Result.fail(new NotArtifactOwnerError())
    }
    await artifactsRepository.deleteArtifact(artifactId)
    return Result.succeed(undefined)
  },
  addArtifact: async (
    content: Omit<
      Artifacts,
      'id' | 'summaryByAI' | 'publishedAt' | 'createdAt' | 'updatedAt'
    >,
    tagIds?: string[],
  ) => {
    if (tagIds !== undefined && !(await tagsRepository.isExistsTags(tagIds))) {
      return Result.fail(new TagNotFoundError(tagIds.join(', ')))
    }

    const artifact = await artifactsRepository.addArtifact({
      ...content,
      summaryByAI: null,
      publishedAt: content.status === 'PUBLISHED' ? new Date() : null,
    })
    if (tagIds !== undefined) {
      await artifactsRepository.registerTags(artifact.id, tagIds)
    }

    return Result.succeed(artifact)
  },
  updateArtifact: async (
    artifactId: string,
    userId: string,
    target: {
      content?: Partial<
        Omit<
          Artifacts,
          | 'id'
          | 'userId'
          | 'summaryByAI'
          | 'publishedAt'
          | 'createdAt'
          | 'updatedAt'
        >
      >
      tagIds?: string[]
    },
  ) => {
    if (!(await artifactsRepository.isOwnArtifact(artifactId, userId))) {
      return Result.fail(new NotArtifactOwnerError())
    }

    if (target.tagIds !== undefined) {
      await artifactsRepository.updateTags(artifactId, target.tagIds)
    }

    if (target.content !== undefined) {
      await artifactsRepository.updateArticle(artifactId, {
        ...target.content,
        publishedAt:
          target.content.status !== undefined
            ? target.content.status === 'PUBLISHED'
              ? new Date()
              : null
            : undefined,
      })
    }

    return Result.succeed(undefined)
  },
  summarizeArtifact: async (artifactId: string) => {
    const body = await artifactsRepository.getArtifactBodyById(artifactId)
    if (body === null) {
      return Result.fail(new ArtifactNotFoundError(artifactId))
    }

    const summaryResult = (await summarizePost(body)).content
    if (typeof summaryResult !== 'string') {
      return Result.fail(new FailedToSummarizeError())
    }
    await artifactsRepository.updateArticle(artifactId, {
      summaryByAI: summaryResult,
    })

    return Result.succeed(undefined)
  },
}
