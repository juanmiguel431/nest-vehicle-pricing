import { Injectable } from '@nestjs/common';
import { FindManyOptions, RemoveOptions, Repository } from 'typeorm';
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
    return this.repository.findOneBy({ email });
  }

  find(options?: FindManyOptions<User> | undefined) {
    return this.repository.find(options);
  }

  create(email: string, password: string) {
    const user = this.repository.create({ email, password });
    return this.repository.save(user);
  }

  remove(entity: User, options?: RemoveOptions) {
    return this.repository.remove(entity, options);
  }
}
