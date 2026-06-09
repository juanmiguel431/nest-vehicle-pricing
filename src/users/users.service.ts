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

  findById(id: number) {
    return this.repository.findOneBy({ id });
  }

  findByEmail(email: string) {
    return this.repository.findOne({ where: { email } });
  }

  findAll(filters?: Partial<User>) {
    return this.repository.find({ where: filters });
  }

  createEntity(email: string, password: string) {
    const user = this.repository.create({ email, password });
    return this.repository.save(user);
  }

  async updateEntity(id: number, attrs: Partial<User>) {
    const user = await this.repository.findOneByOrFail({ id });
    Object.assign(user, attrs);
    return this.repository.save(user);
  }

  async removeEntity(id: number) {
    const user = await this.repository.findOneByOrFail({ id });
    return this.repository.remove(user);
  }

  deleteById(id: number) {
    return this.repository.delete({ id });
  }

  update(id: number, attrs: Partial<User>) {
    return this.repository.update({ id }, attrs);
  }

  insert(user: User) {
    return this.repository.insert(user);
  }

  async updatePasswordEntity(id: number, newPassword: string) {
    return this.updateEntity(id, { password: newPassword });
  }
}
