import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { SalaryEntity } from "./salary.entity";

@Entity('Users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    ID: number;
    
    @Column({ unique: true })
    UserName: string;
    
    @Column({ unique: true })
    NationalNumber: string;
    
    @Column({ unique: true })
    Email: string;
    
    @Column()
    Phone: string;
    
    @Column({ default: true })
    isActive: boolean;

    @OneToMany(() => SalaryEntity, salary => salary.User)
    Salaries: SalaryEntity[];
}
