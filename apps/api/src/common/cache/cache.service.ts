export class CacheService {
  private static store = new Map<string, { value: any; expiresAt: number }>();

  static get<T>(key: string): T | null {
    const item = this.store.get(key);
    if (!item) return null;

    if (Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return item.value as T;
  }

  static set(key: string, value: any, ttlSeconds = 300): void {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.store.set(key, { value, expiresAt });
  }

  static del(key: string): void {
    this.store.delete(key);
  }

  static clear(): void {
    this.store.clear();
  }
}
