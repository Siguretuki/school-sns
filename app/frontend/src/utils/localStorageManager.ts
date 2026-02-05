export class LocalStorageManager<T> {
  private storageKey: string
  private parser: (data: string) => T

  protected constructor(storageKey: string, parser: (data: string) => T) {
    this.storageKey = storageKey
    this.parser = parser
  }

  protected save(data: T): void {
    localStorage.setItem(this.storageKey, JSON.stringify(data))
  }

  protected load(): T | null {
    const item = localStorage.getItem(this.storageKey)
    if (!item) {
      return null
    }
    try {
      return this.parser(item)
    } catch {
      return null
    }
  }

  protected clear(): void {
    localStorage.removeItem(this.storageKey)
  }
}
