class ScrapNotFoundError extends Error {
    constructor(id) {
        super(`Scrap with id ${id} not found`);
        this.name = 'ScrapNotFoundError';
    }
}
class NotScrapOwnerError extends Error {
    constructor(message = 'User is not the owner of the scrap.') {
        super(message);
        this.name = 'NotScrapOwnerError';
    }
}
export { NotScrapOwnerError, ScrapNotFoundError };
