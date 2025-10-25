import { Module } from '@nestjs/common';
import { ProcessStatusService } from './process-status.service';
import { GetEmpStatusController } from './get-emp-status.controller';
import { DataAccessModule } from '../common/data-access/data-access.module';
import { ValidatorModule } from '../common/validator/validator.module';
import { AuthModule } from '../common/auth/auth.module';

@Module({
  imports: [DataAccessModule, ValidatorModule, AuthModule],
  controllers: [GetEmpStatusController],
  providers: [ProcessStatusService],
})
export class GetEmpStatusModule {}
