class InvalidArtifactStatusError extends Error {
    constructor(message = 'The artifact status is invalid.') {
        super(message);
        this.name = 'InvalidArtifactStatusError';
    }
}
export { InvalidArtifactStatusError };
