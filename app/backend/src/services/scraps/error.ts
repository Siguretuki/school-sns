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

class CannotDeleteRootScrapWithChildrenError extends Error {
  constructor(
    message: string = 'Cannot delete a root scrap that has child scraps.',
  ) {
    super(message)
    this.name = 'CannotDeleteRootScrapWithChildrenError'
  }
}

export {
  CannotDeleteRootScrapWithChildrenError,
  NotScrapOwnerError,
  ScrapNotFoundError,
}
