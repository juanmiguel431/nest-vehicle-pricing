import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  private repository: Repository<User>;

  constructor(@InjectRepository(User) repository: Repository<User>) {
    this.repository = repository;
  }

  create(email: string, password: string) {
    const user = this.repository.create({ email, password });
    return this.repository.save(user);
  }

  async findById(id: number) {
    return this.repository.findOneBy({ id });
  }

  findByEmail(email: string) {
    return this.repository.findOne({ where: { email } });
  }

  findAll() {
    return this.repository.find();
  }

  async update(id: number, attrs: Partial<User>) {
    return this.repository.update(id, attrs);
  }

  async updatePassword(id: number, newPassword: string) {
    return this.repository.update(id, { password: newPassword });
  }

  async remove(id: number) {
    return this.repository.delete(id);
  }

  async removeAll() {
    return this.repository.clear();
  }
}
