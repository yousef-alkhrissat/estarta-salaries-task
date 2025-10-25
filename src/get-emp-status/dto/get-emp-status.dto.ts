import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetEmpStatusRequestDto {
  @ApiProperty({
    description: 'Employee National Number',
    example: 'NAT1001',
    type: String
  })
  @IsString()
  @IsNotEmpty()
  NationalNumber: string;
}

export class GetEmpStatusResponseDto {
  @ApiProperty({ example: 'NAT1001' })
  NationalNumber: string;
  
  @ApiProperty({ example: 'jdoe' })
  Username: string;
  
  @ApiProperty({ example: 'jdoe@example.com' })
  Email: string;
  
  @ApiProperty({ example: '0791111111' })
  Phone: string;
  
  @ApiProperty({ example: 1450.00 })
  AverageSalary: number;
  
  @ApiProperty({ example: 1600.00 })
  HighestSalary: number;
  
  @ApiProperty({ example: 7250.00 })
  SumOfSalaries: number;
  
  @ApiProperty({ enum: ['GREEN', 'ORANGE', 'RED'], example: 'RED' })
  Status: 'GREEN' | 'ORANGE' | 'RED';
  
  @ApiProperty({ example: '2025-10-25T00:00:00.000Z' })
  LastUpdated: string;
}

export class ErrorResponseDto {
  @ApiProperty({ example: 'Invalid National Number' })
  error: string;
}
