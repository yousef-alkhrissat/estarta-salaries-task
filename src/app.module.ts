import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GetEmpStatusModule } from './get-emp-status/get-emp-status.module';
import { DataAccessModule } from './common/data-access/data-access.module';
import { LoggerModule } from './common/logger/logger.module';
import { LogViewerModule } from './common/log-viewer/log-viewer.module';
import { SeedService } from './scripts/seed.service';
import databaseConfig from './common/config/database.config';
import { getTypeOrmConfig } from './common/config/typeorm.config';
import { UserEntity } from './get-emp-status/entities/user.entity';
import { SalaryEntity } from './get-emp-status/entities/salary.entity';
import { LogEntry } from './common/logger/logger.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getTypeOrmConfig,
      inject: [ConfigService],
    }),
    GetEmpStatusModule,
    DataAccessModule,
    LoggerModule,
    LogViewerModule,
  ],
  controllers: [AppController],
  providers: [AppService, SeedService],
})
export class AppModule {}
