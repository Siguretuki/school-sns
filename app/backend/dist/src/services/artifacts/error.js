class ArtifactNotFoundError extends Error {
    constructor(id) {
        super(`Artifact with id ${id} not found`);
        this.name = 'ArtifactNotFoundError';
    }
}
class NotArtifactOwnerError extends Error {
    constructor(message = 'User is not the owner of the scrap.') {
        super(message);
        this.name = 'NotArtifactOwnerError';
    }
}
class FailedToSummarizeError extends Error {
    constructor(message = 'Failed to summarize the artifact content.') {
        super(message);
        this.name = 'FailedToSummarizeError';
    }
}
export { NotArtifactOwnerError, ArtifactNotFoundError, FailedToSummarizeError };
