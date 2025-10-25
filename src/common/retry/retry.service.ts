import { Injectable } from '@nestjs/common';

export interface RetryOptions {
  maxAttempts?: number;
  delay?: number;
  backoffMultiplier?: number;
  maxDelay?: number;
}

@Injectable()
export class RetryService {
  private readonly defaultOptions: Required<RetryOptions> = {
    maxAttempts: 3,
    delay: 1000,
    backoffMultiplier: 2,
    maxDelay: 10000
  };

  async executeWithRetry<T>(
    operation: () => Promise<T>,
    options: RetryOptions = {}
  ): Promise<T> {
    const config = { ...this.defaultOptions, ...options };
    let lastError: Error;

    for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === config.maxAttempts) {
          throw lastError;
        }

        const delay = this.calculateDelay(attempt, config);
        await this.sleep(delay);
      }
    }

    throw lastError!;
  }

  private calculateDelay(attempt: number, config: Required<RetryOptions>): number {
    const delay = config.delay * Math.pow(config.backoffMultiplier, attempt - 1);
    return Math.min(delay, config.maxDelay);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async executeDatabaseOperation<T>(
    operation: () => Promise<T>,
    context: string = 'Database operation'
  ): Promise<T> {
    return this.executeWithRetry(operation, {
      maxAttempts: 3,
      delay: 500,
      backoffMultiplier: 2,
      maxDelay: 5000
    });
  }
}
