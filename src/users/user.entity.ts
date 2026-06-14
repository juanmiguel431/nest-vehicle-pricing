import { Entity, Column, PrimaryGeneratedColumn, AfterInsert, AfterRemove, AfterUpdate, OneToMany } from 'typeorm';
import { Report } from '../reports/report.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Report, report => report.user)
  reports: Report[];

  @Column({ default: false })
  isAdmin: boolean;

  @AfterInsert()
  private afterInsert() {
    console.log('Inserted User with id: ', this.id);
  }

  @AfterUpdate()
  private afterUpdate() {
    console.log('Updated User with id: ', this.id);
  }

  @AfterRemove()
  private afterRemove() {
    console.log('Removed User with id: ', this.id);
  }
}