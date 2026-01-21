class UserNotFoundError extends Error {
  constructor(userId: string) {
    super(`User with ID ${userId} not found.`)
    this.name = 'UserNotFoundError'
  }
}

class CannotFollowSelfError extends Error {
  constructor(userId: string) {
    super(`User with ID ${userId} cannot follow themselves.`)
    this.name = 'CannotFollowSelfError'
  }
}

class AlreadyFollowingError extends Error {
  constructor(userId: string, targetUserId: string) {
    super(
      `User with ID ${userId} is already following user with ID ${targetUserId}.`,
    )
    this.name = 'AlreadyFollowingError'
  }
}

export { AlreadyFollowingError, CannotFollowSelfError, UserNotFoundError }
