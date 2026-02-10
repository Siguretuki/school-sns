import { Result } from '@praha/byethrow'
import type { Artifacts } from '../../../generated/prisma/index.js'
import { InvalidArtifactStatusError } from '../../errors.js'
import { toTags } from '../../lib/formatter.js'
import { summarizePost } from '../../lib/langchain/index.js'
import { isPublished, isStatusString } from '../../lib/typeCheckFilter.js'
import { TagNotFoundError } from '../tags/error.js'
import { tagsRepository } from '../tags/repository.js'
import {
  NotArtifactOwnerError,
  ArtifactNotFoundError,
  FailedToSummarizeError,
} from './error.js'
import { artifactsRepository } from './repository.js'
import type { ArtifactOptions } from './type.js'

const triggerSummaryInBackground = (artifactId: string) => {
  void artifactsService
    .summarizeArtifact(artifactId)
    .then((result) => {
      if (result.type === 'Failure') {
        console.error(
          `[artifacts] Failed to summarize artifact in background: ${artifactId} - ${result.error.message}`,
        )
      }
    })
    .catch((error: unknown) => {
      console.error(
        `[artifacts] Unexpected error while summarizing artifact in background: ${artifactId}`,
        error,
      )
    })
}

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

    const artifacts = (
      await artifactsRepository.getArtifacts({
        ...options,
        ids,
        userIds,
        includeDrafts: false,
      })
    )
      .filter(isPublished)
      .filter(isStatusString)
      .map((artifact) => toTags(artifact))

    return Result.succeed(artifacts)
  },
  getArtifactById: async (artifactId: string) => {
    const artifact = await artifactsRepository.getArtifactById(artifactId)
    if (artifact === null) {
      return Result.fail(new ArtifactNotFoundError(artifactId))
    }

    if (!isStatusString(artifact)) {
      throw new InvalidArtifactStatusError()
    }
    return Result.succeed(toTags(artifact))
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
    if (artifact.status === 'PUBLISHED') {
      triggerSummaryInBackground(artifact.id)
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
    const currentArtifact =
      target.content?.status === 'PUBLISHED'
        ? await artifactsRepository.getArtifactById(artifactId)
        : null

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
    if (
      currentArtifact !== null &&
      currentArtifact.status === 'DRAFT' &&
      target.content?.status === 'PUBLISHED'
    ) {
      triggerSummaryInBackground(artifactId)
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
