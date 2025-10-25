import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('LogEntry')
export class LogEntry {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column()
  Level: string;

  @Column()
  Message: string;

  @Column({ nullable: true })
  Context: string;

  @Column({ nullable: true })
  UserId: number;

  @Column({ nullable: true })
  NationalNumber: string;

  @Column({ nullable: true })
  AdditionalData: string;

  @CreateDateColumn()
  CreatedAt: Date;
}
