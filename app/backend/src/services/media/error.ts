class NotOwnerError extends Error {
  constructor(message: string = 'User is not the owner of the media.') {
    super(message)
    this.name = 'NotOwnerError'
  }
}

export { NotOwnerError }
