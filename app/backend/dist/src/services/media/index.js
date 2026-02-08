import { Result } from '@praha/byethrow';
import { NotOwnerError } from './error.js';
import { mediaRepository } from './repository.js';
export const mediaService = {
    upload: async (userId, media) => {
        // upload logic
        // const url = await uploadToStorage(media)
        return Result.succeed(await mediaRepository.register({
            userId,
            url: `https://example.com/media/${media.name}`,
            fileType: media.type,
            originalName: media.name,
            sizeBytes: BigInt(media.size),
        }));
    },
    getUserMedia: async (userId, option) => {
        return Result.succeed(await mediaRepository.getUserMedia(userId, option));
    },
    deleteMedia: async (mediaId, userId) => {
        const isOwn = await mediaRepository.isOwnMedia(mediaId, userId);
        if (!isOwn) {
            return Result.fail(new NotOwnerError());
        }
        return Result.succeed(await mediaRepository.deleteMedia(mediaId));
    },
};
