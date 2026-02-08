class AuthError extends Error {
}
class EmailAlreadyExistsError extends AuthError {
    constructor() {
        super('Email already exists');
        this.name = 'EmailAlreadyExistsError';
    }
}
class InvalidCredentialsError extends AuthError {
    constructor() {
        super('Invalid email or password');
        this.name = 'InvalidCredentialsError';
    }
}
export { EmailAlreadyExistsError, InvalidCredentialsError };
