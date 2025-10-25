import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserEntity } from '../../get-emp-status/entities/user.entity';
import { SalaryEntity } from '../../get-emp-status/entities/salary.entity';
import { LogEntry } from '../../common/logger/logger.entity';

export const getTypeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    database: configService.get('DB_NAME', 'estarta_db'),
    host: configService.get('DB_HOST', 'localhost'),
    port: configService.get('DB_PORT', 5432),
    username: configService.get('DB_USERNAME', 'postgres'),
    password: configService.get('DB_PASSWORD', 'password'),
    entities: [UserEntity, SalaryEntity, LogEntry],
    synchronize: configService.get('DB_SYNCHRONIZE', true),
    logging: configService.get('DB_LOGGING', false),
  };
};
