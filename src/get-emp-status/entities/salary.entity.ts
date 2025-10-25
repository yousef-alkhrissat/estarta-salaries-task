import { Entity, Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Table } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity('Salaries')
export class SalaryEntity {
    @PrimaryGeneratedColumn()
    ID: number;
    
    @Column()
    Year: number;
    
    @Column()
    Month: number;
    
    @Column()
    Salary: number;
    
    @Column()
    UserID: number;
    
    @ManyToOne(() => UserEntity, (user) => user.Salaries)
    @JoinColumn({ name: 'UserID' })
    User: UserEntity;
}
