import { Injectable } from '@nestjs/common';
import { LoggerDataAccessService, LogLevel } from '../data-access/logger-data-access.service';

@Injectable()
export class LoggerService {
  constructor(
    private readonly loggerDataAccessService: LoggerDataAccessService,
  ) {}

  async log(
    level: LogLevel,
    message: string,
    context?: string,
    userId?: number,
    nationalNumber?: string,
    additionalData?: any
  ): Promise<void> {
    await this.loggerDataAccessService.saveLog(
      level,
      message,
      context,
      userId,
      nationalNumber,
      additionalData
    );
  }

  async info(message: string, context?: string, userId?: number, nationalNumber?: string, additionalData?: any): Promise<void> {
    await this.log(LogLevel.INFO, message, context, userId, nationalNumber, additionalData);
  }

  async warn(message: string, context?: string, userId?: number, nationalNumber?: string, additionalData?: any): Promise<void> {
    await this.log(LogLevel.WARN, message, context, userId, nationalNumber, additionalData);
  }

  async error(message: string, context?: string, userId?: number, nationalNumber?: string, additionalData?: any): Promise<void> {
    await this.log(LogLevel.ERROR, message, context, userId, nationalNumber, additionalData);
  }

  async debug(message: string, context?: string, userId?: number, nationalNumber?: string, additionalData?: any): Promise<void> {
    await this.log(LogLevel.DEBUG, message, context, userId, nationalNumber, additionalData);
  }

  async getLogs(limit: number = 100, offset: number = 0) {
    return this.loggerDataAccessService.getLogs(limit, offset);
  }

  async getLogsByUser(nationalNumber: string, limit: number = 50) {
    return this.loggerDataAccessService.getLogsByUser(nationalNumber, limit);
  }

  async getLogsByLevel(level: LogLevel, limit: number = 50) {
    return this.loggerDataAccessService.getLogsByLevel(level, limit);
  }

  async getLogsByContext(context: string, limit: number = 50) {
    return this.loggerDataAccessService.getLogsByContext(context, limit);
  }

  async deleteLogs(olderThan?: Date) {
    return this.loggerDataAccessService.deleteLogs(olderThan);
  }

  async getLogStats() {
    return this.loggerDataAccessService.getLogStats();
  }
}
