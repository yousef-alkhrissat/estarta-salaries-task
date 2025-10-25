import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { DataAccessModule } from '../data-access/data-access.module';

@Module({
  imports: [DataAccessModule],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
