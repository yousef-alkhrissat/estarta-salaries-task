import { Injectable, NotFoundException, NotAcceptableException, UnprocessableEntityException } from '@nestjs/common';
import { DataAccessService } from '../common/data-access/data-access.service';
import { GetEmpStatusRequestDto, GetEmpStatusResponseDto, ErrorResponseDto } from './dto/get-emp-status.dto';
import { UserEntity } from './entities/user.entity';
import { SalaryEntity } from './entities/salary.entity';

@Injectable()
export class ProcessStatusService {
  constructor(private readonly dataAccessService: DataAccessService) {}

  async processEmployeeStatus(request: GetEmpStatusRequestDto): Promise<GetEmpStatusResponseDto | ErrorResponseDto> {
    try {
      const user = await this.dataAccessService.findUserByNationalNumber(request.NationalNumber);
      if (!user) {
        return { error: 'Invalid National Number' };
      }
      if (!user.isActive) {
        return { error: 'User is not Active' };
      }
      const salaries = await this.dataAccessService.findSalariesByUserId(user.ID);
      if (salaries.length < 3) {
        return { error: 'INSUFFICIENT_DATA' };
      }
      const processedSalaries = this.processSalaryData(salaries);
      const averageSalary = this.calculateAverage(processedSalaries);
      const highestSalary = Math.max(...processedSalaries);
      const sumOfSalaries = processedSalaries.reduce((sum, salary) => sum + salary, 0);
      const finalAverage = sumOfSalaries > 10000 ? averageSalary * 0.93 : averageSalary;
      
      const status = this.determineStatus(finalAverage);
        return {
          NationalNumber: user.NationalNumber,
        Username: user.UserName,
        Email: user.Email,
        Phone: user.Phone,
        AverageSalary: Math.round(finalAverage * 100) / 100,
        HighestSalary: Math.round(highestSalary * 100) / 100,
        SumOfSalaries: Math.round(sumOfSalaries * 100) / 100,
        Status: status,
        LastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      throw error;
    }
  }

  private processSalaryData(salaries: SalaryEntity[]): number[] {
    return salaries.map(salary => {
      let adjustedSalary = salary.Salary;

      if (salary.Month === 12) {
        adjustedSalary *= 1.10;
      }
      if (salary.Month === 6 || salary.Month === 7 || salary.Month === 8) {
        adjustedSalary *= 0.95;
      }
      return adjustedSalary;
    });
  }

  private calculateAverage(salaries: number[]): number {
    return salaries.reduce((sum, salary) => sum + salary, 0) / salaries.length;
  }

  private determineStatus(averageSalary: number): 'GREEN' | 'ORANGE' | 'RED' {
    if (averageSalary > 2000) {
      return 'GREEN';
    } else if (averageSalary === 2000) {
      return 'ORANGE';
    } else {
      return 'RED';
    }
  }
}
