import { Entity, Column, PrimaryGeneratedColumn, AfterInsert, AfterRemove, AfterUpdate } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

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