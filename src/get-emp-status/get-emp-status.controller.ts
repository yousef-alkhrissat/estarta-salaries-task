import { Controller, Post, Body, HttpStatus, HttpException, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { ProcessStatusService } from './process-status.service';
import { GetEmpStatusRequestDto, GetEmpStatusResponseDto, ErrorResponseDto } from './dto/get-emp-status.dto';
import { AuthGuard } from '../common/auth/auth.guard';

@ApiTags('employees')
@Controller('GetEmpStatus')
export class GetEmpStatusController {
  constructor(private readonly processStatusService: ProcessStatusService) {}

  @Post('')
  //I'm not using auth rn but it's here for future use
  // @UseGuards(AuthGuard)
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Get employee status and salary information' })
  @ApiBody({ type: GetEmpStatusRequestDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Employee status retrieved successfully',
    type: GetEmpStatusResponseDto 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid or missing API token',
    type: ErrorResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Invalid National Number',
    type: ErrorResponseDto 
  })
  @ApiResponse({ 
    status: 406, 
    description: 'User is not Active',
    type: ErrorResponseDto 
  })
  @ApiResponse({ 
    status: 422, 
    description: 'Insufficient salary data',
    type: ErrorResponseDto 
  })
  async getEmployeeStatus(@Body() request: GetEmpStatusRequestDto): Promise<GetEmpStatusResponseDto | ErrorResponseDto> {
    try {
      const result = await this.processStatusService.processEmployeeStatus(request);
      if ('error' in result) {
        if (result.error === 'Invalid National Number') {
          throw new HttpException(result, HttpStatus.NOT_FOUND);
        } else if (result.error === 'User is not Active') {
          throw new HttpException(result, HttpStatus.NOT_ACCEPTABLE);
        } else if (result.error === 'INSUFFICIENT_DATA') {
          throw new HttpException(result, HttpStatus.UNPROCESSABLE_ENTITY);
        }
      }
      
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
