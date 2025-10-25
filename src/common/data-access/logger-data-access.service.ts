import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogEntry } from '../logger/logger.entity';

export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG'
}

@Injectable()
export class LoggerDataAccessService {
  constructor(
    @InjectRepository(LogEntry)
    private readonly logRepository: Repository<LogEntry>,
  ) {}

  async saveLog(
    level: LogLevel,
    message: string,
    context?: string,
    userId?: number,
    nationalNumber?: string,
    additionalData?: any
  ): Promise<void> {
    try {
      const logEntry = this.logRepository.create({
        Level: level,
        Message: message,
        Context: context || null,
        UserId: userId || null,
        NationalNumber: nationalNumber || null,
        AdditionalData: additionalData ? JSON.stringify(additionalData) : null,
      } as any);

      await this.logRepository.save(logEntry);
    } catch (error) {
      console.error('Failed to save log to database:', error);
    }
  }

  async getLogs(limit: number = 100, offset: number = 0): Promise<LogEntry[]> {
    return this.logRepository.find({
      order: { CreatedAt: 'DESC' },
      take: limit,
      skip: offset
    });
  }

  async getLogsByUser(nationalNumber: string, limit: number = 50): Promise<LogEntry[]> {
    return this.logRepository.find({
      where: { NationalNumber: nationalNumber },
      order: { CreatedAt: 'DESC' },
      take: limit
    });
  }

  async getLogsByLevel(level: LogLevel, limit: number = 50): Promise<LogEntry[]> {
    return this.logRepository.find({
      where: { Level: level },
      order: { CreatedAt: 'DESC' },
      take: limit
    });
  }

  async getLogsByContext(context: string, limit: number = 50): Promise<LogEntry[]> {
    return this.logRepository.find({
      where: { Context: context },
      order: { CreatedAt: 'DESC' },
      take: limit
    });
  }

  async deleteLogs(olderThan?: Date): Promise<number> {
    if (olderThan) {
      const result = await this.logRepository
        .createQueryBuilder()
        .delete()
        .where('CreatedAt < :date', { date: olderThan })
        .execute();
      return result.affected || 0;
    } else {
      const result = await this.logRepository.clear();
      return 0;
    }
  }

  async getLogStats(): Promise<{
    totalLogs: number;
    logsByLevel: Record<string, number>;
    recentLogs: number;
  }> {
    const totalLogs = await this.logRepository.count();
    
    const logsByLevel = await this.logRepository
      .createQueryBuilder('log')
      .select('log.Level', 'level')
      .addSelect('COUNT(*)', 'count')
      .groupBy('log.Level')
      .getRawMany();

    const levelStats: Record<string, number> = {};
    logsByLevel.forEach(stat => {
      levelStats[stat.level] = parseInt(stat.count);
    });

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentLogs = await this.logRepository.count({
      where: {
        CreatedAt: { $gte: oneDayAgo } as any
      }
    });

    return {
      totalLogs,
      logsByLevel: levelStats,
      recentLogs
    };
  }
}
