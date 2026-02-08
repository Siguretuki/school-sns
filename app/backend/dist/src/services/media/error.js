class NotOwnerError extends Error {
    constructor(message = 'User is not the owner of the media.') {
        super(message);
        this.name = 'NotOwnerError';
    }
}
export { NotOwnerError };
