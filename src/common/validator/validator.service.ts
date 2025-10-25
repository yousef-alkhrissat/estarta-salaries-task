import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidatorService {
  async validateInput<T>(dtoClass: new () => T, input: any): Promise<T> {
    const dto = plainToClass(dtoClass, input);
    const errors = await validate(dto as any);
    
    if (errors.length > 0) {
      const errorMessages = errors.map(error => 
        Object.values(error.constraints || {}).join(', ')
      ).join('; ');
      
      throw new Error(`Validation failed: ${errorMessages}`);
    }
    
    return dto;
  }

  validateNationalNumber(nationalNumber: string): boolean {
    return !!nationalNumber && nationalNumber.length > 0;
  }
}
