class ScrapNotFoundError extends Error {
  constructor(id: string) {
    super(`Scrap with id ${id} not found`)
    this.name = 'ScrapNotFoundError'
  }
}

class NotScrapOwnerError extends Error {
  constructor(message: string = 'User is not the owner of the scrap.') {
    super(message)
    this.name = 'NotScrapOwnerError'
  }
}

class AlreadyLikedError extends Error {
  constructor(message: string = 'Scrap is already liked by the user.') {
    super(message)
    this.name = 'AlreadyLikedError'
  }
}

export { AlreadyLikedError, NotScrapOwnerError, ScrapNotFoundError }
