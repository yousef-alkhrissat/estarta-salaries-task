import { Injectable } from '@nestjs/common';
import { DataAccessService } from '../common/data-access/data-access.service';
import { UserEntity } from '../get-emp-status/entities/user.entity';
import { SalaryEntity } from '../get-emp-status/entities/salary.entity';

@Injectable()
export class SeedService {
  constructor(private readonly dataAccessService: DataAccessService) {}

  async seedDatabase(): Promise<void> {
    const users = [
      { ID: 1, UserName: 'jdoe', NationalNumber: 'NAT1001', Email: 'jdoe@example.com', Phone: '0791111111', isActive: true },
      { ID: 2, UserName: 'asalem', NationalNumber: 'NAT1002', Email: 'asalem@example.com', Phone: '0792222222', isActive: true },
      { ID: 3, UserName: 'rhamdan', NationalNumber: 'NAT1003', Email: 'rhamdan@example.com', Phone: '0793333333', isActive: false },
      { ID: 4, UserName: 'lbarakat', NationalNumber: 'NAT1004', Email: 'lbarakat@example.com', Phone: '0794444444', isActive: true },
      { ID: 5, UserName: 'mfaris', NationalNumber: 'NAT1005', Email: 'mfaris@example.com', Phone: '0795555555', isActive: true },
      { ID: 6, UserName: 'nsaleh', NationalNumber: 'NAT1006', Email: 'nsaleh@example.com', Phone: '0796666666', isActive: false },
      { ID: 7, UserName: 'zobeidat', NationalNumber: 'NAT1007', Email: 'zobeidat@example.com', Phone: '0797777777', isActive: true },
      { ID: 8, UserName: 'ahalaseh', NationalNumber: 'NAT1008', Email: 'ahalaseh@example.com', Phone: '0798888888', isActive: true },
      { ID: 9, UserName: 'tkhalaf', NationalNumber: 'NAT1009', Email: 'tkhalaf@example.com', Phone: '0799999999', isActive: false },
      { ID: 10, UserName: 'sshaheen', NationalNumber: 'NAT1010', Email: 'sshaheen@example.com', Phone: '0781010101', isActive: true },
      { ID: 11, UserName: 'tmart', NationalNumber: 'NAT1011', Email: 'tmart@example.com', Phone: '0781099101', isActive: false },
      { ID: 12, UserName: 'aali', NationalNumber: 'NAT1012', Email: 'aali@example.com', Phone: '0781088101', isActive: true },
    ];

    for (const userData of users) {
      try {
        await this.dataAccessService.createUser(userData);
      } catch (error) {
        console.log('users already created', error);
      }
    }

    const salaries = [
      { ID: 1, Year: 2025, Month: 1, Salary: 1200, UserID: 1 },
      { ID: 2, Year: 2025, Month: 2, Salary: 1300, UserID: 1 },
      { ID: 3, Year: 2025, Month: 3, Salary: 1400, UserID: 1 },
      { ID: 4, Year: 2025, Month: 5, Salary: 1500, UserID: 1 },
      { ID: 5, Year: 2025, Month: 6, Salary: 1600, UserID: 1 },
      { ID: 6, Year: 2025, Month: 1, Salary: 900, UserID: 2 },
      { ID: 7, Year: 2025, Month: 2, Salary: 950, UserID: 2 },
      { ID: 8, Year: 2025, Month: 3, Salary: 980, UserID: 2 },
      { ID: 9, Year: 2025, Month: 4, Salary: 1100, UserID: 2 },
      { ID: 10, Year: 2025, Month: 5, Salary: 1150, UserID: 2 },
      { ID: 11, Year: 2025, Month: 1, Salary: 400, UserID: 3 },
      { ID: 15, Year: 2025, Month: 5, Salary: 800, UserID: 3 },
      { ID: 16, Year: 2025, Month: 1, Salary: 2000, UserID: 4 },
      { ID: 17, Year: 2025, Month: 2, Salary: 2050, UserID: 4 },
      { ID: 18, Year: 2025, Month: 3, Salary: 2100, UserID: 4 },
      { ID: 19, Year: 2025, Month: 4, Salary: 2200, UserID: 4 },
      { ID: 20, Year: 2025, Month: 5, Salary: 2300, UserID: 4 },
      { ID: 21, Year: 2025, Month: 1, Salary: 600, UserID: 5 },
      { ID: 22, Year: 2025, Month: 2, Salary: 700, UserID: 5 },
      { ID: 23, Year: 2025, Month: 3, Salary: 750, UserID: 5 },
      { ID: 25, Year: 2025, Month: 5, Salary: 850, UserID: 5 },
      { ID: 26, Year: 2025, Month: 11, Salary: 1500, UserID: 6 },
      { ID: 27, Year: 2025, Month: 12, Salary: 1550, UserID: 6 },
      { ID: 28, Year: 2025, Month: 1, Salary: 1600, UserID: 6 },
      { ID: 29, Year: 2025, Month: 2, Salary: 1650, UserID: 6 },
      { ID: 30, Year: 2025, Month: 3, Salary: 1700, UserID: 6 },
      { ID: 31, Year: 2025, Month: 4, Salary: 2000, UserID: 6 },
      { ID: 32, Year: 2025, Month: 1, Salary: 1000, UserID: 7 },
      { ID: 33, Year: 2025, Month: 2, Salary: 1100, UserID: 7 },
      { ID: 34, Year: 2025, Month: 3, Salary: 1150, UserID: 7 },
      { ID: 35, Year: 2025, Month: 4, Salary: 1200, UserID: 7 },
      { ID: 36, Year: 2025, Month: 5, Salary: 1250, UserID: 7 },
      { ID: 37, Year: 2025, Month: 6, Salary: 1350, UserID: 7 },
      { ID: 38, Year: 2025, Month: 7, Salary: 1500, UserID: 7 },
      { ID: 39, Year: 2025, Month: 10, Salary: 2200, UserID: 8 },
      { ID: 40, Year: 2025, Month: 11, Salary: 2300, UserID: 8 },
      { ID: 41, Year: 2025, Month: 12, Salary: 2400, UserID: 8 },
      { ID: 42, Year: 2025, Month: 1, Salary: 2500, UserID: 8 },
      { ID: 43, Year: 2025, Month: 2, Salary: 2600, UserID: 8 },
      { ID: 44, Year: 2025, Month: 3, Salary: 2800, UserID: 8 },
      { ID: 45, Year: 2025, Month: 1, Salary: 1700, UserID: 9 },
      { ID: 46, Year: 2025, Month: 2, Salary: 1750, UserID: 9 },
      { ID: 47, Year: 2025, Month: 6, Salary: 1800, UserID: 9 },
      { ID: 48, Year: 2025, Month: 7, Salary: 1850, UserID: 9 },
      { ID: 49, Year: 2025, Month: 8, Salary: 1900, UserID: 9 },
      { ID: 50, Year: 2025, Month: 1, Salary: 800, UserID: 10 },
      { ID: 51, Year: 2025, Month: 2, Salary: 850, UserID: 10 },
      { ID: 52, Year: 2025, Month: 3, Salary: 900, UserID: 10 },
      { ID: 53, Year: 2025, Month: 8, Salary: 950, UserID: 10 },
      { ID: 54, Year: 2025, Month: 9, Salary: 1000, UserID: 10 },
      { ID: 55, Year: 2025, Month: 10, Salary: 1200, UserID: 10 },
    ];

    for (const salaryData of salaries) {
      try {
        await this.dataAccessService.createSalary(salaryData);
      } catch (error) {
        console.log('salaries already created', error);
      }
    }

  }
}
