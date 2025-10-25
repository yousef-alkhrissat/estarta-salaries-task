import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataAccessService } from './data-access.service';
import { LoggerDataAccessService } from './logger-data-access.service';
import { UserEntity } from '../../get-emp-status/entities/user.entity';
import { SalaryEntity } from '../../get-emp-status/entities/salary.entity';
import { LogEntry } from '../logger/logger.entity';
import { CacheModule } from '../cache/cache.module';
import { RetryModule } from '../retry/retry.module';
import { FileLoggerModule } from '../file-logger/file-logger.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, SalaryEntity, LogEntry]),
    CacheModule,
    RetryModule,
    FileLoggerModule
  ],
  providers: [DataAccessService, LoggerDataAccessService],
  exports: [DataAccessService, LoggerDataAccessService],
})
export class DataAccessModule {}
