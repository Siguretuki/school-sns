import { Result } from '@praha/byethrow';
import { TagNotFoundError } from '../tags/error.js';
import { tagsRepository } from '../tags/repository.js';
import { NotScrapOwnerError, ScrapNotFoundError } from './error.js';
import { scrapsRepository } from './repository.js';
export const scrapsService = {
    getScraps: async (options, followingUserFilter) => {
        const userIds = followingUserFilter !== undefined
            ? (await scrapsRepository.getFollowingUserIds(followingUserFilter.userId)).map(({ followeeId }) => followeeId)
            : undefined;
        const ids = options?.tagIds
            ? (await scrapsRepository.getScrapIdsByTagIds(options.tagIds)).map(({ scrapId }) => scrapId)
            : undefined;
        const scraps = await scrapsRepository.getScraps({
            ...options,
            onlyRootScraps: options?.onlyRootScraps ?? true,
            includeUserInfo: options?.includeUserInfo ?? true,
            userIds,
            ids,
        });
        return Result.succeed(scraps);
    },
    getScrapById: async (scrapId) => {
        const scrap = await scrapsRepository.getScrapById(scrapId);
        if (scrap === null) {
            return Result.fail(new ScrapNotFoundError(scrapId));
        }
        return Result.succeed(scrap);
    },
    deleteScrap: async (scrapId, userId) => {
        if (!(await scrapsRepository.isOwnScrap(scrapId, userId))) {
            return Result.fail(new NotScrapOwnerError());
        }
        await scrapsRepository.deleteScrap(scrapId);
        return Result.succeed(undefined);
    },
    addScrap: async (content, tagIds) => {
        if (tagIds !== undefined && !(await tagsRepository.isExistsTags(tagIds))) {
            return Result.fail(new TagNotFoundError(tagIds.join(', ')));
        }
        const scrap = await scrapsRepository.addScrap(content);
        if (tagIds !== undefined) {
            await scrapsRepository.registerTags(scrap.id, tagIds);
        }
        return Result.succeed(scrap);
    },
    updateScrap: async (scrapId, userId, content, tagIds) => {
        if (!(await scrapsRepository.isOwnScrap(scrapId, userId))) {
            return Result.fail(new NotScrapOwnerError());
        }
        if (tagIds !== undefined) {
            await scrapsRepository.updateTags(scrapId, tagIds);
        }
        if (content !== undefined) {
            await scrapsRepository.updateScrap(scrapId, content);
        }
        return Result.succeed(undefined);
    },
};
