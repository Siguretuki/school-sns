class ExistsTagNameError extends Error {
  constructor(tagName: string) {
    super(`Tag:${tagName} is Already Exists.`)
  }
}

class TagNotFoundError extends Error {
  constructor(tagId: string) {
    super(`Tag not found with id:${tagId}`)
  }
}

class TagAttachedOthersResource extends Error {
  constructor(tagId: string) {
    super(`Tag(id: ${tagId}) contained others artifact or scraps.`)
  }
}

class InvalidQueryOptions extends Error {}
export {
  ExistsTagNameError,
  InvalidQueryOptions,
  TagAttachedOthersResource,
  TagNotFoundError,
}
