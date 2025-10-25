import { Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AppService } from './app.service';
import { SeedService } from './scripts/seed.service';
import { LoggerService } from './common/logger/logger.service';

@ApiTags('admin')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly seedService: SeedService,
    private readonly loggerService: LoggerService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get application status' })
  @ApiResponse({ status: 200, description: 'Application is running' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('seed')
  @ApiOperation({ summary: 'Seed database with sample data' })
  @ApiResponse({ status: 200, description: 'Database seeded successfully' })
  async seedDatabase(): Promise<{ message: string }> {
    await this.seedService.seedDatabase();
    return { message: 'Database seeded successfully' };
  }

  @Get('logs')
  @ApiOperation({ summary: 'Get application logs' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of logs to retrieve' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Number of logs to skip' })
  @ApiResponse({ status: 200, description: 'Logs retrieved successfully' })
  async getLogs(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number
  ) {
    const logs = await this.loggerService.getLogs(limit || 100, offset || 0);
    return { logs, count: logs.length };
  }

  @Get('logs/stats')
  @ApiOperation({ summary: 'Get log statistics' })
  @ApiResponse({ status: 200, description: 'Log statistics retrieved successfully' })
  async getLogStats() {
    return this.loggerService.getLogStats();
  }
}
