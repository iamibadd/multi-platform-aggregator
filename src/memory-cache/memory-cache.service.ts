import { Injectable } from '@nestjs/common';
import * as memoryCache from 'memory-cache';

@Injectable()
export class MemoryCacheService {
  private memoryCache = new memoryCache.Cache<string, object>();
  private readonly TTL = 10 * 60 * 1000;

  setMemoryCache(location: string, data: object): void {
    this.memoryCache.put(location, data, this.TTL);
  }

  getMemoryCache(location: string): object | null {
    const cached = this.memoryCache.get(location);
    if (cached) return cached;
    return null;
  }
}
