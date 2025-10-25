import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../get-emp-status/entities/user.entity';
import { SalaryEntity } from '../../get-emp-status/entities/salary.entity';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

@Injectable()
export class CacheService {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  getUserCacheKey(nationalNumber: string): string {
    return `user:${nationalNumber}`;
  }

  getSalariesCacheKey(userId: number): string {
    return `salaries:${userId}`;
  }

  cacheUser(user: UserEntity): void {
    const key = this.getUserCacheKey(user.NationalNumber);
    this.set(key, user, 10 * 60 * 1000); // 10 minutes for user data
  }

  getCachedUser(nationalNumber: string): UserEntity | null {
    const key = this.getUserCacheKey(nationalNumber);
    return this.get<UserEntity>(key);
  }

  cacheSalaries(userId: number, salaries: SalaryEntity[]): void {
    const key = this.getSalariesCacheKey(userId);
    this.set(key, salaries, 15 * 60 * 1000); // 15 minutes for salary data
  }

  getCachedSalaries(userId: number): SalaryEntity[] | null {
    const key = this.getSalariesCacheKey(userId);
    return this.get<SalaryEntity[]>(key);
  }

  invalidateUser(nationalNumber: string): void {
    const key = this.getUserCacheKey(nationalNumber);
    this.cache.delete(key);
  }

  invalidateSalaries(userId: number): void {
    const key = this.getSalariesCacheKey(userId);
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}
