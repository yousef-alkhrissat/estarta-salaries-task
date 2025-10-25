import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG'
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  userId?: number;
  nationalNumber?: string;
  additionalData?: any;
}

@Injectable()
export class FileLoggerService {
  private readonly logDir = path.join(process.cwd(), 'logs');
  private readonly logFile = path.join(this.logDir, 'application.log');

  constructor() {
    this.ensureLogDirectory();
  }

  private ensureLogDirectory(): void {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private formatLogEntry(entry: LogEntry): string {
    const timestamp = entry.timestamp;
    const level = entry.level;
    const message = entry.message;
    const context = entry.context ? `[${entry.context}]` : '';
    const userInfo = entry.nationalNumber ? `[${entry.nationalNumber}]` : '';
    const additionalData = entry.additionalData ? ` | ${JSON.stringify(entry.additionalData)}` : '';
    
    return `${timestamp} ${level} ${context} ${userInfo} ${message}${additionalData}\n`;
  }

  async log(
    level: LogLevel,
    message: string,
    context?: string,
    userId?: number,
    nationalNumber?: string,
    additionalData?: any
  ): Promise<void> {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      userId,
      nationalNumber,
      additionalData
    };

    const formattedLog = this.formatLogEntry(logEntry);
    
    try {
      fs.appendFileSync(this.logFile, formattedLog);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
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

  async getLogs(limit: number = 100, offset: number = 0): Promise<string[]> {
    try {
      if (!fs.existsSync(this.logFile)) {
        return [];
      }

      const logContent = fs.readFileSync(this.logFile, 'utf8');
      const lines = logContent.split('\n').filter(line => line.trim() !== '');
      
      const startIndex = Math.max(0, lines.length - limit - offset);
      const endIndex = lines.length - offset;
      
      return lines.slice(startIndex, endIndex).reverse();
    } catch (error) {
      console.error('Failed to read log file:', error);
      return [];
    }
  }

  async getLogsByLevel(level: LogLevel, limit: number = 50): Promise<string[]> {
    try {
      if (!fs.existsSync(this.logFile)) {
        return [];
      }

      const logContent = fs.readFileSync(this.logFile, 'utf8');
      const lines = logContent.split('\n').filter(line => line.trim() !== '');
      
      const filteredLines = lines.filter(line => line.includes(level));
      return filteredLines.slice(-limit).reverse();
    } catch (error) {
      console.error('Failed to read log file by level:', error);
      return [];
    }
  }

  async getLogsByUser(nationalNumber: string, limit: number = 50): Promise<string[]> {
    try {
      if (!fs.existsSync(this.logFile)) {
        return [];
      }

      const logContent = fs.readFileSync(this.logFile, 'utf8');
      const lines = logContent.split('\n').filter(line => line.trim() !== '');
      
      const filteredLines = lines.filter(line => line.includes(`[${nationalNumber}]`));
      return filteredLines.slice(-limit).reverse();
    } catch (error) {
      console.error('Failed to read log file by user:', error);
      return [];
    }
  }

  async clearLogs(): Promise<void> {
    try {
      if (fs.existsSync(this.logFile)) {
        fs.writeFileSync(this.logFile, '');
      }
    } catch (error) {
      console.error('Failed to clear log file:', error);
    }
  }

  getLogFilePath(): string {
    return this.logFile;
  }

  getLogDirectory(): string {
    return this.logDir;
  }
}
