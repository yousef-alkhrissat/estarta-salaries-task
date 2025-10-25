import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../get-emp-status/entities/user.entity';
import { SalaryEntity } from '../../get-emp-status/entities/salary.entity';
import { CacheService } from '../cache/cache.service';
import { RetryService } from '../retry/retry.service';
import { FileLoggerService } from '../file-logger/file-logger.service';

@Injectable()
export class DataAccessService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(SalaryEntity)
    private readonly salaryRepository: Repository<SalaryEntity>,
    private readonly cacheService: CacheService,
    private readonly retryService: RetryService,
    private readonly fileLoggerService: FileLoggerService,
  ) {}
  async findUserById(id: number): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { ID: id } });
  }

  async findUserByNationalNumber(nationalNumber: string): Promise<UserEntity | null> {
    const cachedUser = this.cacheService.getCachedUser(nationalNumber);
    if (cachedUser) {
      await this.fileLoggerService.debug('User found in cache', 'DataAccess', undefined, nationalNumber);
      return cachedUser;
    }

    try {
      const user = await this.retryService.executeDatabaseOperation(
        () => this.userRepository.findOne({ where: { NationalNumber: nationalNumber } }),
        'findUserByNationalNumber'
      );

      if (user) {
        this.cacheService.cacheUser(user);
        await this.fileLoggerService.info('User retrieved from database', 'DataAccess', user.ID, nationalNumber);
      }

      return user;
    } catch (error) {
      await this.fileLoggerService.error('Failed to find user by national number', 'DataAccess', undefined, nationalNumber, { error: error.message });
      throw error;
    }
  }

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { Email: email } });
  }

  async findAllUsers(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async createUser(userData: Partial<UserEntity>): Promise<UserEntity> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async updateUser(id: number, userData: Partial<UserEntity>): Promise<UserEntity | null> {
    await this.userRepository.update(id, userData);
    return this.findUserById(id);
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async findSalaryById(id: number): Promise<SalaryEntity | null> {
    return this.salaryRepository.findOne({ where: { ID: id } });
  }

  async findSalariesByUserId(userId: number): Promise<SalaryEntity[]> {
    const cachedSalaries = this.cacheService.getCachedSalaries(userId);
    if (cachedSalaries) {
      await this.fileLoggerService.debug('Salaries found in cache', 'DataAccess', userId);
      return cachedSalaries;
    }

    try {
      const salaries = await this.retryService.executeDatabaseOperation(
        () => this.salaryRepository.find({ where: { UserID: userId } }),
        'findSalariesByUserId'
      );

      this.cacheService.cacheSalaries(userId, salaries);
      await this.fileLoggerService.info('Salaries retrieved from database', 'DataAccess', userId, undefined, { count: salaries.length });

      return salaries;
    } catch (error) {
      await this.fileLoggerService.error('Failed to find salaries by user ID', 'DataAccess', userId, undefined, { error: error.message });
      throw error;
    }
  }

  async findSalaryByUserAndPeriod(userId: number, year: number, month: number): Promise<SalaryEntity | null> {
    return this.salaryRepository.findOne({ 
      where: { 
        UserID: userId, 
        Year: year, 
        Month: month 
      } 
    });
  }

  async findAllSalaries(): Promise<SalaryEntity[]> {
    return this.salaryRepository.find();
  }

  async createSalary(salaryData: Partial<SalaryEntity>): Promise<SalaryEntity> {
    const salary = this.salaryRepository.create(salaryData);
    return this.salaryRepository.save(salary);
  }

  async updateSalary(id: number, salaryData: Partial<SalaryEntity>): Promise<SalaryEntity | null> {
    await this.salaryRepository.update(id, salaryData);
    return this.findSalaryById(id);
  }

  async deleteSalary(id: number): Promise<boolean> {
    const result = await this.salaryRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async findUserWithSalaries(userId: number): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { ID: userId },
      relations: ['User']
    });
  }
}
