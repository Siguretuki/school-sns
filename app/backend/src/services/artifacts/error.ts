class ArtifactNotFoundError extends Error {
  constructor(id: string) {
    super(`Artifact with id ${id} not found`)
    this.name = 'ArtifactNotFoundError'
  }
}

class NotArtifactOwnerError extends Error {
  constructor(message: string = 'User is not the owner of the scrap.') {
    super(message)
    this.name = 'NotArtifactOwnerError'
  }
}

class FailedToSummarizeError extends Error {
  constructor(message: string = 'Failed to summarize the artifact content.') {
    super(message)
    this.name = 'FailedToSummarizeError'
  }
}

export { NotArtifactOwnerError, ArtifactNotFoundError, FailedToSummarizeError }
