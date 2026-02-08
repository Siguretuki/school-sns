import { Result } from '@praha/byethrow';
import { AlreadyFollowingError, CannotFollowSelfError, UserNotFoundError, } from './error.js';
import { usersRepository } from './repository.js';
export const usersService = {
    getUserDetail: async (id) => {
        const user = await usersRepository.getById(id);
        if (user === null) {
            return Result.fail(new UserNotFoundError(id));
        }
        return Result.succeed(user);
    },
    editUser: async (id, input) => {
        const updatedUser = await usersRepository.updateById(id, input);
        return Result.succeed(updatedUser);
    },
    followUser: async (userId, targetUserId) => {
        if (userId === targetUserId) {
            return Result.fail(new CannotFollowSelfError(userId));
        }
        if (await usersRepository.isFollowed(userId, targetUserId)) {
            return Result.fail(new AlreadyFollowingError(userId, targetUserId));
        }
        await usersRepository.followUser(userId, targetUserId);
        return Result.succeed(undefined);
    },
    cancelFollower: async (userId, targetUserId) => {
        await usersRepository.cancelFollower(userId, targetUserId);
        return Result.succeed(undefined);
    },
    getFollowers: async (userId) => {
        const followers = await usersRepository.getFollowers(userId);
        return Result.succeed(followers);
    },
    getFollowees: async (userId) => {
        const followees = await usersRepository.getFollowees(userId);
        return Result.succeed(followees);
    },
    getContentsByUserId: async (userId) => {
        const contents = await usersRepository.getContentsByUserId(userId);
        return Result.succeed(contents);
    },
};
